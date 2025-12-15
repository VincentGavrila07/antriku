export interface QueueItem {
  queue_number: string;
  customer_name: string | null;
}

export interface DisplayServiceType {
  service_id: number;
  service_name: string;
  staff_names: string[]; // array karena bisa lebih dari 1
  current_queue: QueueItem | null;
  next_queue: QueueItem | null;
}
