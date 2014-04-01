
# Distribution files that need to be copied and modified locally
config_dist_files=(
    'app/workflow/params.sh.dist'
    'app/config/params.js.dist'
)

config_remote_host='mkrause.nl'
config_remote_username='root'
config_remote_path='/var/www/mkrause.nl/public_html/test'

config_open() {
    # Needs to be defined locally
    return
}

# Import local params
if [ -f "${script_dir}/params.sh" ]; then
    . "${script_dir}/params.sh"
fi
