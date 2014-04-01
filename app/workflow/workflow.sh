#!/bin/bash
# Workflow automatization tool

# This script expects the following variables to be set:
# - root_dir        Directory containing the project.
# - script_dir      Directory containing the workflow script and configuration.

# We need to be called with a root directory variable already set
if [ -z "$root_dir" ]; then
    echo "Error: no root directory given."
    exit 1
fi

# Bash configuration
shopt -s nullglob # Expand globs with zero matches to zero arguments instead of the glob pattern
shopt -s dotglob # Match dot files
#shopt -s globstar # Not supported in Bash < 4 :'(

cli_args=("$@") # Save a copy of the CLI arguments so we're free to mangle `$@`

# Colors
col_reset="\x1b[39;49;00m"
col_red="\x1b[31;01m"
col_green="\x1b[32;01m"
col_yellow="\x1b[33;01m"
col_blue="\x1b[34;01m"
col_magenta="\x1b[35;01m"
col_cyan="\x1b[36;01m"

show_help() {
    cat <<'EOT'
usage: workflow [--help] [--version]
                <command> [<args>]

Commands:
open        Open any necessary applications to work on this project (e.g. editor).
install     Set up a newly created working directory.
configure   Configure the project.
update      Update dependencies.
outdated    Check for any outdated dependencies.
status      Check the state of the project.
build       Run build scripts.
test        Run test scripts.
run         Run the project.
deploy      Deploy the project.
sync        Upload files to a remote server.
watch       Watch for changes in the project directory, and synchronize automatically.
edit        Edit files on a remote server.
EOT
}

show_version() {
    echo "version 0.1"
}

# Parse command line options (sets: cmd, args, options)
parse_options() {
    cmd=""
    args=()
    options=()
    
    # http://stackoverflow.com/questions/402377
    for arg in $@; do
        case "$arg" in
            -h | --help)
                show_help
                exit 0
                ;;
            -v | --version)
                show_version
                exit 0
                ;;
            # Anything that looks like an option
            -*)
                # Other options may be parsed later
                options+=($arg)
                ;;
            # Anything else (either a command or argument)
            *)
                if [ -z "$cmd" ]; then
                    cmd=$arg
                else
                    args+=($arg)
                fi
                ;;
        esac
    done
}

# -----------------
# Util
# -----------------

# Verify that a certain tool is installed
verify_installed() {
    for cmd in $@; do
        if ! which $cmd >/dev/null; then
            echo -en "${col_red}ERROR: This script requires \"$cmd\", which is not currently"
            echo -e " installed${col_reset}"
            exit 1
        fi
    done
}

# -----------------
# Commands
# -----------------

cmd_open() {
    # User-defined project open command
    config_open
}

cmd_install() {
    cmd_configure "$@"
    cmd_update "$@"
    
    # Check permissions/owners (e.g. file write permissions)
    #TODO
}

cmd_configure() {
    echo -e "${col_green}Configuring local configuration...${col_reset}"
    
    for dist_file in "${config_dist_files[@]}"; do
        src="$dist_file"
        dst="${dist_file%.dist}" # Remove .dist extension
        
        # Skip if already exists
        if [ -f "${root_dir}/${dst}" ]; then
            echo "Skipping $dst (already exists)"
            continue
        fi
        
        # Copy file
        (set -x; cp "${root_dir}/${src}" "${root_dir}/${dst}") # Subshell with debug mode
        
        # Allow the user to edit the newly copied file
        vim "${root_dir}/${dst}"
    done
}

cmd_update() {
    verify_installed npm bower
    
    echo -e "${col_green}Updating dependencies.${col_reset}"
    
    # npm
    npm update
    
    # bower
    (cd "${root_dir}/web" && bower update)
}

cmd_outdated() {
    verify_installed npm bower
    
    # npm
    echo -e "${col_green}Checking npm...${col_reset}"
    # Get all outdated packages, filter on lines that look like "[package]@[version]"
    npm outdated | grep -E '^[^ ]+@[^ ]+'
    # Note: older versions of npm don't include devDependencies in "npm outdated":
    # https://github.com/npm/npm/issues/3250
    echo -e "${col_yellow}To update, run \"npm update\"${col_reset}"
    
    # bower
    echo -e "${col_green}Checking bower...${col_reset}"
    # Have bower generate the list of dependencies, then check for lines indicating a new release
    # (Also, remove the tree display prefix)
    cd "${root_dir}/web"
    bower list # | grep 'available\|latest' | sed -E 's/^[^a-zA-Z0-9]+//'
    cd "${root_dir}"
    echo -e "${col_yellow}To update, run \"bower update\"${col_reset}"
}

cmd_status() {
    verify_installed git
    git status
}

cmd_build() {
    verify_installed grunt
    grunt
}

cmd_test() {
    #...
    return
}

cmd_run() {
    verify_installed npm
    npm start
}

cmd_deploy() {
    #...
    return
}

cmd_sync() {
    host="$config_remote_host"
    username="$config_remote_username"
    path_local="${root_dir}/" # Trailing slash so it syncs the directory contents
    path_remote="$config_remote_path"
    
    # Paths to exclude from syncing
    # Note: all paths are relative to the source directory, and if you don't add a preceding "/"
    # it will match *all* paths with that name
    # http://askubuntu.com/questions/349613
    excludes="--exclude-from .gitignore --exclude=.DS_Store --exclude /.git"
    includes=""
    
    options=""
    restart_server=0
    dry_run=0
    
    # Options parsing
    for arg in "$@"; do
        case "$arg" in
            --) break ;; # Use "--" as a signal to stop options processing
            --exclude=*)
                path=${arg#--exclude=} # Remove the prefixed option name
                excludes="$excludes --exclude $path" # Append the exclude to the list
                ;;
            --include=*)
                path=${arg#--include=} # Remove the prefixed option name
                includes="$includes --include $path" # Append the include to the list
                ;;
            --rsync-options=*)
                rsync_options=${arg#--rsync-options=}
                options="$options $rsync_options"
                ;;
            --restart-server) restart_server=1 ;;
            --dry-run) dry_run=1; options="$options --dry-run" ;;
        esac
    done
    
    echo -e "${col_green}Synchronizing files...${col_reset}"
    
    if [ "$dry_run" = 1 ]; then
        echo -e "${col_yellow}(Dry run)${col_reset}"
    fi
    
    # Sync files
    # -rvtpl recursive, verbose, preserve timestamps and permissions, sync symlinks
    set -x;
    rsync -rvtpl "${path_local}" "${username}@${host}:${path_remote}"\
        $includes $excludes $options --delete
    { set +x; } 2>/dev/null # Quietly disable set -x
    
    if [ "$restart_server" = 1 ]; then
        echo -e "${col_green}Restarting server...${col_reset}"
        ssh "${username}@${host}" "/etc/init.d/apache2 restart"
    fi
    
    #TODO: provide a way to actually install the project if it hasn't been installed yet?
}

cmd_edit() {
    host="$config_remote_host"
    username="$config_remote_username"
    path_remote="$config_remote_path"
    
    restart_server=0
    custom_path=''
    
    # Options parsing
    for arg in "$@"; do
        case "$arg" in
            --) break ;;
            --php-ini) custom_path='/etc/php5/cli/conf.d/custom.ini'; restart_server=1 ;;
        esac
    done
    
    if [ -n "$custom_path" ]; then
        vim "scp://${username}@${host}/${custom_path}"
    else
        vim "scp://${username}@${host}/${path_remote}/$1"
    fi
    
    if [ "$restart_server" = 1 ]; then
        echo -e "${col_green}Restarting server...${col_reset}"
        ssh "${username}@${host}" "/etc/init.d/apache2 restart"
    fi
}

cmd_watch() {
    # A few alternatives:
    # inotify (Linux)
    # https://github.com/alandipert/fswatch (OS X)
    # https://github.com/axkibe/lsyncd
    
    verify_installed fswatch && fswatch . "${script_dir}/workflow sync"
}


# Parse command line options
cmd=""
args=()
options=()
parse_options "$@"

# Import configuration
. "${script_dir}/config.sh"

# Not installed yet?
if [ "$cmd" != "install" ] && [ ! -f "${script_dir}/params.sh" ]; then
    echo -e "${col_red}This app is not yet installed! Run the \"install\" command.${col_reset}"
    exit 1
fi

# Run the specified command
case "$cmd" in
    open)
        cmd_open "${args[@]}" "${options[@]}" ;;
    install)
        cmd_install "${args[@]}" "${options[@]}" ;;
    configure)
        cmd_configure "${args[@]}" "${options[@]}" ;;
    update)
        cmd_update "${args[@]}" "${options[@]}" ;;
    outdated)
        cmd_outdated "${args[@]}" "${options[@]}" ;;
    status)
        cmd_status "${args[@]}" "${options[@]}" ;;
    build)
        cmd_build "${args[@]}" "${options[@]}" ;;
    test)
        cmd_test "${args[@]}" "${options[@]}" ;;
    run)
        cmd_run "${args[@]}" "${options[@]}" ;;
    deploy)
        cmd_deploy "${args[@]}" "${options[@]}" ;;
    sync)
        cmd_sync "${args[@]}" "${options[@]}" ;;
    edit)
        cmd_edit "${args[@]}" "${options[@]}" ;;
    watch)
        cmd_watch "${args[@]}" "${options[@]}" ;;
    ?*) # Fallback (non-empty string)
        echo "Unrecognized command \"$cmd\""
        exit 1
        ;;
    *) # Fallback (empty string)
        show_help
        exit 0
        ;;
esac

echo -e "${col_green}Done.${col_reset}"
