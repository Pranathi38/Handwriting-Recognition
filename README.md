sudo adduser ansible

sudo usermod -aG sudo ansible

sudo su - ansible

sudo apt update

sudo apt install openssh-server -y

sudo systemctl start ssh

sudo systemctl enable ssh

sudo systemctl status ssh

hostname -i

ssh-keygen

ssh-copy-id ansible@<IP_ADDRESS>

sudo apt update

sudo apt install ansible -y

ansible --version

sudo mkdir -p /etc/ansible

nano inventory.ini

ansible-inventory -i inventory.ini --list -y

sudo ansible all -m ping

mkdir ansible-playbooks

cd ansible-playbooks

nano basic-playbook.yml

ansible-playbook basic-playbook.yml -i inventory.ini

ansible-doc ping

ansible all -m setup



---
- name: Basic Ansible Playbook
  hosts: all
  become: yes

  tasks:
    - name: Ping all servers
      ping:

    - name: Install Apache
      apt:
        name: apache2
        state: present
        update_cache: yes
