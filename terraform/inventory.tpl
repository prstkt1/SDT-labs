[workers]
worker ansible_host=${worker_ip} ansible_user=${ssh_user} ansible_ssh_private_key_file=${ssh_key}

[db]
db ansible_host=${db_ip} ansible_user=${ssh_user} ansible_ssh_private_key_file=${ssh_key}

[all:vars]
ansible_ssh_common_args='-o StrictHostKeyChecking=no'
ansible_python_interpreter=/usr/bin/python3