variable "ssh_public_key" {
  description = "Вміст публічного SSH ключа (~/.ssh/lab4_key.pub)"
  type        = string
}

variable "ssh_key_path" {
  description = "Шлях до приватного SSH ключа для Ansible"
  type        = string
  default     = "~/.ssh/lab4_key"
}

variable "hostonly_interface" {
  description = "Назва Host-Only адаптера у VirtualBox"
  type        = string
  default     = "VirtualBox Host-Only Ethernet Adapter"
}

variable "vm_memory" {
  description = "RAM у MiB"
  type        = number
  default     = 1024
}

variable "vm_vcpu" {
  description = "Кількість vCPU"
  type        = number
  default     = 1
}