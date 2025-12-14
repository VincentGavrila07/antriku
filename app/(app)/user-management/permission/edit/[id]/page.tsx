"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spin, Checkbox, Button, Card, notification } from "antd";
import PermissionService from "@/services/PermissionService";
import RoleService from "@/services/RoleService";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Role } from "@/types/Role";

export default function EditPermissionPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const { data: permissionDetail, isLoading: loadingDetail } = useQuery({
    queryKey: ["permission", id],
    queryFn: () => PermissionService.getPermissionById(id as string),
  });

  const { data: allRoles, isLoading: loadingRoles } = useQuery<Role[]>({
    queryKey: ["all-roles"],
    queryFn: () => RoleService.getAllRole().then(res => res.data),
  });

  const { data: assignedRoles, isLoading: loadingAssigned } = useQuery<Role[]>({
    queryKey: ["assigned-roles", id],
    queryFn: () => PermissionService.getRolesByPermission(id as string),
  });

  useEffect(() => {
    if (assignedRoles && selectedRoles.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedRoles(
        assignedRoles.map(role => role.id.toString()) 
      );
    }
  }, [assignedRoles, selectedRoles]);


  const updateMutation = useMutation({
    mutationFn: () =>
      PermissionService.updatePermissionRoles(
        id as string,
        selectedRoles.map(Number) 
      ),
    onSuccess: () => {
      notification.success({
        title: "Berhasil Update Permission",
        description: "Role untuk permission ini berhasil diperbarui",
      });
      router.push("/user-management/permission");
    },
    onError: () => {
      notification.error({
        title: "Gagal Update Permission",
        description: "Terjadi kesalahan saat menyimpan data",
      });
    },
  });


  if (loadingDetail || loadingRoles || loadingAssigned) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">
        Edit Permission: {permissionDetail?.name}
      </h1>

      {/* Info Permission */}
      <Card title="Permission Info" className="mb-4">
        <p><strong>Name:</strong> {permissionDetail?.name}</p>
        <p><strong>Slug:</strong> {permissionDetail?.slug}</p>
      </Card>

      {/* Multi-Select Roles */}
      <Card title="Assign Roles (Multi-Select)">
        <Checkbox.Group
          value={selectedRoles}
          onChange={(values) => setSelectedRoles(values as string[])}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allRoles?.map((role) => (
              <Checkbox key={role.id} value={role.id.toString()}>
                {role.name}
              </Checkbox>
            ))}
          </div>
        </Checkbox.Group>

        <Button
          type="primary"
          className="mt-5"
          loading={updateMutation.isPending}
          onClick={() => updateMutation.mutate()}
        >
          Simpan
        </Button>
      </Card>
    </div>
  );
}
