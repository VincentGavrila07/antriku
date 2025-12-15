"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spin, Checkbox, Button, Card, notification } from "antd";
import PermissionService from "@/services/PermissionService";
import RoleService from "@/services/RoleService";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Role } from "@/types/Role";
import { useLanguage } from "@/app/languange-context";

import type { Translations } from "@/app/languange-context";

export default function EditPermissionPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { translations, loading: langLoading } = useLanguage();
  const t: Translations["userManagement"] | undefined = translations?.userManagement;

  if (langLoading || !t) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spin size="large" />
      </div>
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: permissionDetail, isLoading: loadingDetail } = useQuery({
    queryKey: ["permission", id],
    queryFn: () => PermissionService.getPermissionById(id as string),
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: allRoles, isLoading: loadingRoles } = useQuery<Role[]>({
    queryKey: ["all-roles"],
    queryFn: () => RoleService.getAllRole().then((res) => res.data),
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: assignedRoles, isLoading: loadingAssigned } = useQuery<Role[]>({
    queryKey: ["assigned-roles", id],
    queryFn: () => PermissionService.getRolesByPermission(id as string),
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (assignedRoles && selectedRoles.length === 0) {
      setSelectedRoles(assignedRoles.map((role) => role.id.toString()));
    }
  }, [assignedRoles, selectedRoles]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const updateMutation = useMutation({
    mutationFn: () =>
      PermissionService.updatePermissionRoles(
        id as string,
        selectedRoles.map(Number)
      ),
    onSuccess: () => {
      notification.success({
        title: t.SuccessUpdate,
        description: t.SuccessUpdateDesc,
      });
      router.push("/user-management/permission");
    },
    onError: () => {
      notification.error({
        title: t.ErrorUpdate,
        description: t.ErrorUpdateDesc,
      });
    },
  });

  if (langLoading || loadingDetail || loadingRoles || loadingAssigned) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">
        {t.EditPermission}: {permissionDetail?.name}
      </h1>

      {/* Info Permission */}
      <Card title={t.PermissionInfo} className="mb-4">
        <p>
          <strong>{t.Name}:</strong> {permissionDetail?.name}
        </p>
        <p>
          <strong>{t.Slug}:</strong> {permissionDetail?.slug}
        </p>
      </Card>

      {/* Multi-Select Roles */}
      <Card title={t.AssignRoles}>
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
          {t.Save}
        </Button>
      </Card>
    </div>
  );
}
