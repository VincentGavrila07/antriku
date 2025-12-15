  "use client";

  import React, { useState } from "react";
  import { Modal, Select, DatePicker, Form, notification } from "antd";
  import Breadcrumbs from "@/app/components/breadcrumbs";
  import moment from "moment";
  import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
  import TableServiceOrder from "@/app/Tables/table-service-order";
  import { Service, ServiceResponsePagination } from "@/types/Service";
  import ServiceService from "@/services/ServiceService";
  import { useLanguage } from "@/app/languange-context";
  import type { Translations } from "@/app/languange-context";

  export default function OrderPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(
      null
    );
    const [staffList, setStaffList] = useState<{ id: number; name: string }[]>(
      []
    );
    const [form] = Form.useForm();
    const { translations, loading: langLoading } = useLanguage();
    const t: Translations["order"] | undefined = translations?.order;

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const queryClient = useQueryClient();

    // Pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    /* ===============================
     * FETCH SERVICE LIST
     * =============================== */
    const { data: services, isLoading } = useQuery<
      ServiceResponsePagination<Service[]>,
      Error
    >({
      queryKey: ["services", page, pageSize],
      queryFn: () =>
        ServiceService.getAllService({
          page,
          pageSize,
        }),
    });

    /* ===============================
     * BOOK SERVICE MUTATION
     * =============================== */
    const bookServiceMutation = useMutation({
      mutationFn: ServiceService.bookService,
      onSuccess: (res) => {
        const queueCode = res.data?.queue_code;
        notification.success({
          title: t?.SuccessBooking,
          description: t ? t.QueueNumber + ": " + queueCode : undefined,
        });

        setIsModalOpen(false);
        form.resetFields();
        queryClient.invalidateQueries({ queryKey: ["services"] });
      },
      onError: () => {
        notification.error({
          title: t?.ErrorBooking,
          description: t?.ActiveQueueExists,
        });
      },
    });

    /* ===============================
     * CLICK ORDER
     * =============================== */
    const handleOrderClick = async (service: Service) => {
      setSelectedService(service);

      try {
        const res = await fetch(`${BASE_URL}/services/${service.id}/staff`);
        const data = await res.json();
        setStaffList(data.staff ?? []);
      } catch {
        setStaffList([]);
      }

      setIsModalOpen(true);
    };

    /* ===============================
     * SUBMIT MODAL
     * =============================== */
    const handleModalOk = async () => {
      try {
        const values = await form.validateFields();

        const userRaw = localStorage.getItem("user");
        if (!userRaw || !selectedService) {
          notification.error({
            title: t?.InvalidUserOrService,
            description: t?.PleaseRelogin,
          });
          return;
        }

        const user = JSON.parse(userRaw);

        bookServiceMutation.mutate({
          service_id: selectedService.id,
          user_id: user.id, // ✅ FIX UTAMA
          queue_date: values.date.format("YYYY-MM-DD"),
        });
      } catch (err) {
        console.log("Validation Failed:", err);
      }
    };

    const handleModalCancel = () => {
      setIsModalOpen(false);
      form.resetFields();
    };

    /* ===============================
     * RENDER
     * =============================== */
    return (
      <div className="p-6">
        <Breadcrumbs items={[{ label: t?.OrderService ?? "", href: "/order" }]} />

        <h2 className="text-3xl font-semibold mb-6 mt-5">{t?.OrderService}</h2>

        <TableServiceOrder
          data={services?.data ?? []}
          total={services?.total ?? 0}
          page={services?.current_page ?? page}
          pageSize={services?.per_page ?? pageSize}
          isLoading={isLoading}
          onChange={(newPage, newPageSize) => {
            setPage(newPage);
            if (newPageSize) setPageSize(newPageSize);
          }}
          onOrder={handleOrderClick}
        />

        <Modal
          title={
            t
              ? t.BookingTitle +
                (selectedService ? ` ${selectedService.name}` : "")
              : undefined
          }
          open={isModalOpen}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          okText={t?.Book}
          confirmLoading={bookServiceMutation.isPending}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label={t?.SelectStaff}
              name="staff_id"
              rules={[{ required: true, message: t?.SelectStaffRequired }]}
            >
              <Select
                placeholder={t?.SelectStaff}
                options={staffList.map((s) => ({
                  value: s.id,
                  label: s.name,
                }))}
              />
            </Form.Item>

            <Form.Item
              label={t?.ArrivalDate}
              name="date"
              rules={[{ required: true, message: t?.ArrivalDateRequired }]}
            >
              <DatePicker
                className="w-full"
                disabledDate={(current) =>
                  current && current < moment().startOf("day")
                }
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
