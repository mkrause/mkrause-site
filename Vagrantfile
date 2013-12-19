Vagrant.configure("2") do |config|
    # https://dl.dropboxusercontent.com/s/xymcvez85i29lym/vagrant-debian-wheezy64.box
    config.vm.box = "wheezy64"
    
    config.vm.network :forwarded_port, host: 8002, guest: 80
    config.vm.network "private_network", ip: "192.168.56.101"
    
    config.vm.synced_folder "./", "/var/www", id: "vagrant-root", :nfs => false
    
    config.vm.usable_port_range = (2200..2250)
    config.vm.provider :virtualbox do |virtualbox|
        virtualbox.customize ["modifyvm", :id, "--name", "mkrause-site"]
        virtualbox.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
        virtualbox.customize ["modifyvm", :id, "--memory", "1024"]
        virtualbox.customize ["setextradata", :id, "--VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
    end
    
    config.vm.provision :shell, :path => "env/setup.sh"
    
    config.ssh.username = "vagrant"
    config.ssh.shell = "bash -l"
    
    config.ssh.keep_alive = true
    config.ssh.forward_agent = false
    config.ssh.forward_x11 = false
    config.vagrant.host = :detect
end
