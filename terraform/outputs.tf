output "worker_ip" {
  value = virtualbox_vm.worker.network_adapter[1].ipv4_address
}

output "db_ip" {
  value = virtualbox_vm.db.network_adapter[1].ipv4_address
}