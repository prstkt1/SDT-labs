terraform {
  required_version = ">= 1.3.0"
  required_providers {
    virtualbox = {
      source  = "terra-farm/virtualbox"
      version = "0.2.2-alpha.1"
    }
  }
}

locals {
  ubuntu_box = "https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64-vagrant.box"
}

resource "virtualbox_vm" "worker" {
  name      = "lab4-worker"
  image     = local.ubuntu_box
  cpus      = var.vm_vcpu
  memory    = "${var.vm_memory} mib"
  user_data = templatefile("${path.module}/cloud-init/common.yaml", {
    hostname       = "worker"
    ssh_public_key = var.ssh_public_key
  })

  network_adapter {
    type = "nat"
  }

  network_adapter {
    type           = "hostonly"
    host_interface = var.hostonly_interface
  }
}

resource "virtualbox_vm" "db" {
  name      = "lab4-db"
  image     = local.ubuntu_box
  cpus      = var.vm_vcpu
  memory    = "${var.vm_memory} mib"
  user_data = templatefile("${path.module}/cloud-init/common.yaml", {
    hostname       = "db"
    ssh_public_key = var.ssh_public_key
  })

  network_adapter {
    type = "nat"
  }

  network_adapter {
    type           = "hostonly"
    host_interface = var.hostonly_interface
  }
}

resource "local_file" "ansible_inventory" {
  content = templatefile("${path.module}/inventory.tpl", {
    worker_ip = virtualbox_vm.worker.network_adapter[1].ipv4_address
    db_ip     = virtualbox_vm.db.network_adapter[1].ipv4_address
    ssh_key   = var.ssh_key_path
    ssh_user  = "ansible"
  })
  filename        = "${path.module}/../ansible/inventory/hosts.ini"
  file_permission = "0644"
}