# Dungeonz.io server

The central game server for Dungeonz.io.

***************************************
************* Game server *************
***************************************

	1# Update Ubuntu packages
apt-get update && apt-get upgrade

    2# Update NodeJS
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

	3# Copy package.json to /home/server, then
npm install

	4# Move dungeonz.service file to /etc/systemd/system, so the server can be run as a service, and can be auto-restarted.

	5# Allow connections to port 3000 through UFW.
sudo ufw allow 3000

    6# Let'sEncrypt Certbot setup - https://www.digitalocean.com/community/tutorials/how-to-use-certbot-standalone-mode-to-retrieve-let-s-encrypt-ssl-certificates-on-ubuntu-16-04


***************************************
*************** General ***************
***************************************

	Start a server process
sudo systemctl start dungeonz

	Restart a server process
sudo systemctl restart dungeonz

	Check a server process status
sudo systemctl status dungeonz

	View system log output
/var/log/syslog

    Longer log output
https://unix.stackexchange.com/questions/225401/how-to-see-full-log-from-systemctl-status-service
journalctl -u dungeonz.service

	Delete a directory and all contents
rm -rf DIR_TO_DELETE

    See the the permission of a file
ls -l /path/to/file