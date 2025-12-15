"use client";

import { Typography, Row, Col, Card, Space, Spin, theme, GlobalToken } from "antd";
import { useQuery } from "@tanstack/react-query";
import DisplayService from "@/services/DisplayService";
import { DisplayServiceType } from "@/types/Display";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { useToken } = theme;

const serviceCardStyle = (token: GlobalToken) => ({
  borderRadius: 20,
  minHeight: 280,
  textAlign: "center",
  boxShadow: `0 10px 30px rgba(0,0,0,0.1), 0 0 0 1px ${token.colorBorderSecondary}`,
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: `0 15px 40px rgba(0,0,0,0.15), 0 0 0 1px ${token.colorPrimary}`,
  },
});

const nowBoxStyle = (token: GlobalToken) => ({
  padding: 20,
  background: token.colorWarningBg,
  borderRadius: 16,
  border: `2px solid ${token.colorWarning}`,
  boxShadow: `0 4px 10px rgba(0,0,0,0.15)`,
});

const nextBoxStyle = (token: GlobalToken) => ({
  padding: 16,
  background: token.colorInfoBg,
  borderRadius: 16,
  border: `2px solid ${token.colorInfo}`,
  boxShadow: `0 2px 5px rgba(0,0,0,0.05)`,
});

export default function DisplayTVPage() {
  const { token } = useToken();

  const { data, isLoading } = useQuery<{ data: DisplayServiceType[] }, Error>({
    queryKey: ["displayServices"],
    queryFn: () => DisplayService.getAllServices(),
    refetchInterval: 5000,
  });

  const services: DisplayServiceType[] = data?.data ?? [];

  return (
    <div style={{ padding: 40, background: token.colorBgLayout, minHeight: "100vh" }}>
      <Title
        level={1}
        style={{
          textAlign: "center",
          marginBottom: 50,
          color: token.colorTextHeading,
          fontWeight: 700,
          letterSpacing: "1px",
        }}
      >
        <ClockCircleOutlined style={{ marginRight: 15 }} />
        Display Antrian Layanan
      </Title>

      {isLoading ? (
        <div style={{ textAlign: "center", marginTop: 150 }}>
          <Spin size="large" tip={<Text style={{ color: token.colorPrimary }}>Memuat Data...</Text>} />
        </div>
      ) : (
        <Row gutter={[32, 32]} justify="center">
          {services.map((service) => (
            <Col xs={24} sm={12} md={8} lg={6} key={service.service_id}>
              <Card
                bordered={false}
                styles={serviceCardStyle(token)}
                bodyStyle={{ padding: 0 }}
              >
                <div
                  style={{
                    padding: "20px 20px 10px",
                    background: token.colorPrimaryBg,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  }}
                >
                  <Text strong style={{ fontSize: 24, color: token.colorPrimary }}>
                    {service.service_name}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 16 }}>
                    <UserOutlined /> {service.staff_names.join(", ")}
                  </Text>
                </div>

                <div style={{ padding: 20 }}>
                  <Space
                    orientation="vertical"
                    size={20}
                    style={{ width: "100%" }}
                  >
                    <div style={nowBoxStyle(token)}>
                      <Text strong style={{ fontSize: 18, color: token.colorWarning }}>
                        SEDANG DIPANGGIL:
                      </Text>
                      <br />
                      {service.current_queue ? (
                        <>
                          <Title
                            level={1}
                            style={{ margin: "10px 0", color: token.colorWarningText, fontWeight: 900, fontSize: "4rem" }}
                          >
                            {service.current_queue.queue_number}
                          </Title>
                          <Text style={{ fontSize: 16, color: token.colorText }}>
                            {service.current_queue.customer_name}
                          </Text>
                        </>
                      ) : (
                        <Text style={{ fontSize: 28, fontWeight: 700 }}>-</Text>
                      )}
                    </div>

                    <div style={nextBoxStyle(token)}>
                      <Text strong style={{ fontSize: 18, color: token.colorInfo }}>
                        BERIKUTNYA:
                      </Text>
                      <br />
                      {service.next_queue ? (
                        <>
                          <Title level={3} style={{ margin: "8px 0", color: token.colorInfoText, fontWeight: 700 }}>
                            {service.next_queue.queue_number}
                          </Title>
                          <Text style={{ fontSize: 14, color: token.colorTextSecondary }}>
                            {service.next_queue.customer_name}
                          </Text>
                        </>
                      ) : (
                        <Text style={{ fontSize: 18, fontWeight: 600 }}>-</Text>
                      )}
                    </div>
                  </Space>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}