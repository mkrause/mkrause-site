config_dist_files=(
    'app/workflow_params.sh.dist'
    'app/config/params.php.dist'
)

config_remote_host='mkrause.nl'
config_remote_username='root'
config_remote_path='/var/www/mkrause.nl/public_html/test'

config_open() {
    # Needs to be defined locally
    return
}

# Import local params
if [ -f "${script_dir}/workflow_params.sh" ]; then
    . "${script_dir}/workflow_params.sh"
fi
