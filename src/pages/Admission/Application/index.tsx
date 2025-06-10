  import React, { useEffect, useState } from 'react';
  import { Form, Input, Button, Select, InputNumber, message, Typography, Divider } from 'antd';
  import axios from 'axios';

  const { Option } = Select;
  const { Title } = Typography;



  const ApplicationPage: React.FC = () => {
    const [form] = Form.useForm();
    const [majors, setMajors] = useState<Major[]>([]);
    const [combinations, setCombinations] = useState<SubjectCombination[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      axios.get('http://localhost:3000/majors').then((res) => {
        setMajors(res.data);
      });
    }, []);

    const onMajorChange = (majorId: number) => {
      form.setFieldsValue({ combinationId: undefined });
      axios.get(`http://localhost:3000/majors-combinations/${majorId}`).then((res) => {
        setCombinations([res.data.combination]);
        console.log([res.data.combination]);
      });
    };

    const onFinish = async (values: any) => {
      const payload = {
        userId: 1, // giả lập userId
        majorId: values.majorId,
        combinationId: values.combinationId,
        score: values.score,
        priorityObject: values.priorityObject,
        personalInfo: {
          name: values.name,
          email: values.email,
          cccd: values.cccd,
          address: values.address,
          phone: values.phone,
        },
      };

      try {
        setLoading(true);
        await axios.post('http://localhost:3000/applications', payload);
        message.success('Nộp hồ sơ thành công!');
        form.resetFields();
        setCombinations([]);
      } catch (error) {
        console.error(error);
        message.error('Lỗi khi nộp hồ sơ');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div style={{ maxWidth: 1000, margin: 'auto', padding: 24 }}>
        <Title level={3}>Nộp Hồ Sơ Xét Tuyển</Title>
        <Divider />
        <Form layout='vertical' form={form} onFinish={onFinish}>
          <Title level={5}>Thông tin cá nhân</Title>

          <Form.Item name='name' label='Họ tên' rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name='email' label='Email' rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>

          <Form.Item name='cccd' label='Số CCCD' rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name='phone' label='Số điện thoại' rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name='address' label='Địa chỉ' rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Divider />

          <Title level={5}>Thông tin xét tuyển</Title>
          <Form.Item name='majorId' label='Ngành' rules={[{ required: true }]}>
            <Select placeholder='Chọn ngành' onChange={onMajorChange}>
              {majors.map((m) => (
                <Option key={m.id} value={m.id}>
                  {m.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name='combinationId' label='Tổ hợp xét tuyển' rules={[{ required: true }]}>
            <Select placeholder='Chọn tổ hợp' disabled={!combinations.length}>
              {combinations.map((c) => (
                <Option key={c.id} value={c.id}>
                  {c.code} ({c.subjects})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name='score' label='Điểm xét tuyển' rules={[{ required: true }]}>
            <InputNumber min={0} max={30} step={0.1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name='priorityObject' label='Đối tượng ưu tiên'>
            <Input placeholder='Ví dụ: KV1, DT1, ...' />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' loading={loading}>
              Nộp hồ sơ
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };

  export default ApplicationPage;
