import { 
  Form, 
  Input, 
  Button, 
  Select, 
  DatePicker, 
  Radio, 
  Upload, 
  Card, 
  Divider, 
  InputNumber, 
  message 
} from 'antd';
import { history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import './index.less';

// Ánh xạ giữa value và text cho trường và ngành
// axios 
const schoolOptions = [
  { value: 'school1', label: 'Đại học Bách Khoa Hà Nội' },
  { value: 'school2', label: 'Đại học Quốc Gia Hà Nội' },
  { value: 'school3', label: 'Đại học Kinh tế Quốc dân' },
];

const majorOptions = [
  { value: 'major1', label: 'Công nghệ thông tin' },
  { value: 'major2', label: 'Kỹ thuật điện tử' },
  { value: 'major3', label: 'Kinh tế đối ngoại' },
];

const ApplicationPage: React.FC = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    // Tìm tên trường và ngành dựa trên giá trị đã chọn
    const selectedSchool = schoolOptions.find(option => option.value === values.school);
    const selectedMajor = majorOptions.find(option => option.value === values.major);

    // Format ngày hiện tại
    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    // Lấy danh sách hồ sơ từ localStorage hoặc tạo mới nếu chưa có
    let applications = [];
    try {
      const existingData = localStorage.getItem('admissionApplications');
      applications = existingData ? JSON.parse(existingData) : [];
    } catch (e) {
      applications = [];
    }

    // Tìm ID lớn nhất hiện có
    let maxId = 0; // Bắt đầu từ 0, nếu không có hồ sơ nào thì ID mới sẽ là 1
    if (applications.length > 0) {
      // Tìm ID lớn nhất trong danh sách
      maxId = Math.max(...applications.map((app: any) => app.id));
    }

    // Tạo dữ liệu hồ sơ mới với ID là maxId + 1
    const newApplication = {
      id: maxId + 1,
      school: selectedSchool?.label || values.school,
      major: selectedMajor?.label || values.major,
      fullName: values.fullName,
      submissionDate: formattedDate,
      status: 'pending',
    };

    // Thêm hồ sơ mới vào danh sách
    applications.push(newApplication);

    // Lưu lại vào localStorage
    localStorage.setItem('admissionApplications', JSON.stringify(applications));

    message.success('Hồ sơ xét tuyển đã được gửi thành công!');

    // Chuyển hướng đến trang status
    history.push('/admission/status');
  };

  return (
    <PageContainer title="Đăng ký xét tuyển">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >

      
        <Card title="Thông tin trường và ngành học" className="form-card">
          <Form.Item name="school" label="Trường" rules={[{ required: true, message: 'Vui lòng chọn trường' }]}>
            <Select placeholder="Chọn trường">
              {schoolOptions.map(option => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="major" label="Ngành" rules={[{ required: true, message: 'Vui lòng chọn ngành' }]}>
            <Select placeholder="Chọn ngành">
              {majorOptions.map(option => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="combination" label="Tổ hợp xét tuyển" rules={[{ required: true, message: 'Vui lòng chọn tổ hợp xét tuyển' }]}>
            <Select placeholder="Chọn tổ hợp">
              <Select.Option value="A00">A00 (Toán, Lý, Hoá)</Select.Option>
              <Select.Option value="A01">A01 (Toán, Lý, Anh)</Select.Option>
              <Select.Option value="B00">B00 (Toán, Hoá, Sinh)</Select.Option>
              <Select.Option value="D01">D01 (Toán, Văn, Anh)</Select.Option>
            </Select>
          </Form.Item>
        </Card>
        
        <Card title="Thông tin cá nhân" className="form-card">
          <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="dob" label="Ngày sinh" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}>
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}>
            <Radio.Group>
              <Radio value="male">Nam</Radio>
              <Radio value="female">Nữ</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="cccd" label="CCCD/CMND" rules={[{ required: true, message: 'Vui lòng nhập CCCD/CMND' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}>
            <Input />
          </Form.Item>
        </Card>
        
        <Card title="Điểm thi và đối tượng ưu tiên" className="form-card">
          <Form.List name="scores">
            {(fields, { add, remove }) => (
              <>
                {fields.map(field => (
                  <div key={field.key} style={{ display: 'flex', marginBottom: 8 }}>
                    <Form.Item
                      {...field}
                      name={[field.name, 'subject']}
                      rules={[{ required: true, message: 'Chọn môn học' }]}
                      style={{ width: '50%', marginRight: 8 }}
                    >
                      <Select placeholder="Môn học">
                        <Select.Option value="toan">Toán</Select.Option>
                        <Select.Option value="ly">Vật lý</Select.Option>
                        <Select.Option value="hoa">Hóa học</Select.Option>
                        <Select.Option value="anh">Tiếng Anh</Select.Option>
                        <Select.Option value="van">Ngữ văn</Select.Option>
                        <Select.Option value="sinh">Sinh học</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'score']}
                      rules={[{ required: true, message: 'Nhập điểm' }]}
                      style={{ width: '50%' }}
                    >
                      <InputNumber min={0} max={10} step={0.01} style={{ width: '100%' }} placeholder="Điểm" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)} style={{ margin: '8px 0 0 8px' }} />
                  </div>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm môn học
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Divider orientation="left">Đối tượng ưu tiên</Divider>

          <Form.Item name="priorityType" label="Loại đối tượng">
            <Radio.Group>
              <Radio value="01">Đối tượng 01 (Con thương binh, liệt sĩ)</Radio>
              <Radio value="02">Đối tượng 02 (Người dân tộc thiểu số)</Radio>
              <Radio value="03">Đối tượng 03 (Người từ vùng khó khăn)</Radio>
              <Radio value="00">Không có</Radio>
            </Radio.Group>
          </Form.Item>
        </Card>
        
        <Card title="Tải lên minh chứng" className="form-card">
          <Form.Item name="cccdUpload" label="Ảnh CCCD/CMND (2 mặt)" rules={[{ required: true, message: 'Vui lòng tải lên ảnh CCCD/CMND' }]}>
            <Upload
              listType="picture-card"
              accept=".jpg,.jpeg,.png,.pdf"
              beforeUpload={(file) => {
                // Giả lập upload, trả về false để ngăn tự động upload
                return false;
              }}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item name="transcriptUpload" label="Ảnh học bạ" rules={[{ required: true, message: 'Vui lòng tải lên ảnh học bạ' }]}>
            <Upload
              listType="picture-card"
              accept=".jpg,.jpeg,.png,.pdf"
              beforeUpload={(file) => {
                // Giả lập upload, trả về false để ngăn tự động upload
                return false;
              }}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item name="otherDocuments" label="Tài liệu khác (nếu có)">
            <Upload
              listType="picture-card"
              accept=".jpg,.jpeg,.png,.pdf"
              beforeUpload={(file) => {
                // Giả lập upload, trả về false để ngăn tự động upload
                return false;
              }}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
        </Card>
        
        <div className="submit-container">
          <Button type="primary" htmlType="submit" size="large">
            Xác nhận và gửi hồ sơ
          </Button>
        </div>
       
      </Form>
    </PageContainer>
  );
};

export default ApplicationPage; 