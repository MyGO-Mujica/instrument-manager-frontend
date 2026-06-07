# 实验室仪器共享管理系统 - 前端开发文档

## 项目概述

实验室仪器共享管理系统，支持三种角色：学生、教师、管理员。

**后端地址**: `http://localhost:8000`  
**接口前缀**: `/api`

---

## 认证方式

所有需要登录的接口（除注册登录外）都需要在请求头中携带 Token：

```
Authorization: Bearer {access_token}
```

Token 有效期为 24 小时。

---

## 一、认证模块

### 1.1 用户注册

**POST** `/api/auth/register`

**请求体**:
```json
{
  "username": "string",      // 登录账号，必填
  "password": "string",      // 密码，必填
  "role": "student",         // 角色：student 或 teacher，必填
  "real_name": "string",     // 真实姓名，必填
  "student_id": "string",    // 学号/工号，可选
  "department": "string",    // 院系，可选
  "phone": "string",         // 电话，可选
  "email": "string"          // 邮箱，可选
}
```

**响应**:
```json
{
  "user_id": 1,
  "username": "zhangsan",
  "role": "student",
  "real_name": "张三",
  "student_id": "2024001",
  "department": "计算机学院",
  "phone": "13800138000",
  "email": "zhangsan@example.com",
  "created_at": "2024-01-15T08:30:00"
}
```

**说明**: 管理员账号不能通过注册创建，需后台直接创建。

---

### 1.2 用户登录

**POST** `/api/auth/login`

**请求体**:
```json
{
  "username": "string",
  "password": "string"
}
```

**响应**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "user_id": 1,
    "username": "zhangsan",
    "role": "student",
    "real_name": "张三",
    "student_id": "2024001",
    "department": "计算机学院",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "created_at": "2024-01-15T08:30:00"
  }
}
```

---

### 1.3 用户登出

**POST** `/api/auth/logout`

**请求头**: `Authorization: Bearer {token}`

**响应**:
```json
{
  "message": "已登出"
}
```

---

## 二、仪器管理模块

### 2.1 获取分类列表

**GET** `/api/categories`

**响应**:
```json
[
  {
    "category_id": 1,
    "name": "电子测量仪器"
  },
  {
    "category_id": 2,
    "name": "光学仪器"
  }
]
```

---

### 2.2 获取仪器列表

**GET** `/api/instruments`

**请求头**: `Authorization: Bearer {token}`

**查询参数**:
- `category_id` (可选): 按分类筛选
- `status` (可选): 按状态筛选，`available` | `in_use` | `maintenance`
- `keyword` (可选): 按名称关键词搜索

**响应**:
```json
[
  {
    "instrument_id": 1,
    "name": "数字示波器",
    "model": "DSO-X 3034T",
    "asset_tag": "E001-2024",
    "category_id": 1,
    "location": "实验楼A301",
    "status": "available",
    "description": "4通道，350MHz带宽"
  }
]
```

**状态说明**:
- `available`: 空闲，可预约
- `in_use`: 使用中
- `maintenance`: 维修中

---

### 2.3 获取仪器详情

**GET** `/api/instruments/{instrument_id}`

**请求头**: `Authorization: Bearer {token}`

**响应**: 同仪器列表单项

---

### 2.4 添加仪器（管理员）

**POST** `/api/instruments`

**请求头**: `Authorization: Bearer {token}`（需管理员权限）

**请求体**:
```json
{
  "name": "string",          // 仪器名称，必填
  "model": "string",         // 型号，可选
  "asset_tag": "string",     // 资产编号，可选
  "category_id": 1,          // 分类ID，必填
  "location": "string",      // 存放地点，可选
  "description": "string"    // 描述，可选
}
```

**响应**: 返回创建的仪器信息

---

### 2.5 修改仪器（管理员）

**PUT** `/api/instruments/{instrument_id}`

**请求头**: `Authorization: Bearer {token}`（需管理员权限）

**请求体**:
```json
{
  "name": "string",
  "model": "string",
  "asset_tag": "string",
  "category_id": 1,
  "location": "string",
  "status": "available",     // 可修改状态
  "description": "string"
}
```

**响应**: 返回更新后的仪器信息

---

### 2.6 删除仪器（管理员）

**DELETE** `/api/instruments/{instrument_id}`

**请求头**: `Authorization: Bearer {token}`（需管理员权限）

**响应**:
```json
{
  "message": "已删除"
}
```

---

## 三、预约管理模块

### 3.1 获取预约列表

**GET** `/api/reservations`

**请求头**: `Authorization: Bearer {token}`

**查询参数**:
- `status` (可选): 按状态筛选，`pending` | `approved` | `rejected` | `cancelled` | `completed`
- `date_from` (可选): 起始日期，格式 `2024-01-15`
- `date_to` (可选): 结束日期，格式 `2024-01-20`

**响应**:
```json
[
  {
    "reservation_id": 1,
    "user_id": 2,
    "instrument_id": 1,
    "date": "2024-01-20",
    "slot_id": 1,
    "status": "pending",
    "apply_time": "2024-01-15T10:30:00",
    "approve_time": null,
    "admin_id": null,
    "remark": null
  }
]
```

**状态说明**:
- `pending`: 待审批
- `approved`: 已通过
- `rejected`: 已拒绝
- `cancelled`: 已取消
- `completed`: 已完成

**权限说明**:
- 普通用户：只能看到自己的预约
- 管理员：可以看到所有用户的预约

---

### 3.2 创建预约

**POST** `/api/reservations`

**请求头**: `Authorization: Bearer {token}`

**请求体**:
```json
{
  "instrument_id": 1,
  "date": "2024-01-20",
  "slot_id": 1
}
```

**时段说明**:
| slot_id | 时段 | 时间 |
|---------|------|------|
| 1 | 第1节 | 08:00 - 10:00 |
| 2 | 第2节 | 10:00 - 12:00 |
| 3 | 第3节 | 14:00 - 16:00 |
| 4 | 第4节 | 16:00 - 18:00 |

**响应**: 返回创建的预约信息

**错误情况**:
- 400: 仪器不存在或不可用
- 400: 该时段已被预约（时间冲突）

---

### 3.3 取消预约

**PUT** `/api/reservations/{reservation_id}/cancel`

**请求头**: `Authorization: Bearer {token}`

**说明**: 只能取消自己的预约，且必须是未审批（pending）状态的预约。

**响应**:
```json
{
  "message": "已取消"
}
```

---

### 3.4 审批预约（管理员）

**PUT** `/api/reservations/{reservation_id}/approve`

**请求头**: `Authorization: Bearer {token}`（需管理员权限）

**请求体**:
```json
{
  "action": "approved",      // "approved" 或 "rejected"
  "remark": "string"         // 备注，可选
}
```

**响应**:
```json
{
  "message": "审批完成"
}
```

**说明**:
- 审批通过后，仪器状态会自动变为 `in_use`
- 预约完成或取消后，仪器状态会自动恢复为 `available`

---

## 四、页面功能建议

### 4.1 登录注册页
- 登录表单（用户名、密码）
- 注册表单（角色选择、基本信息）
- Token 本地存储（localStorage 或 cookie）

### 4.2 仪器浏览页（所有登录用户）
- 仪器列表展示（卡片或表格）
- 分类筛选
- 状态筛选
- 关键词搜索
- 点击可查看详情

### 4.3 仪器详情页
- 仪器详细信息
- 预约按钮（跳转到预约页面）

### 4.4 预约页面
- 选择日期（日期选择器）
- 选择时段（4个时段单选）
- 提交预约

### 4.5 我的预约页
- 预约列表（按状态筛选）
- 取消预约按钮（仅 pending 状态显示）

### 4.6 管理员后台
- 仪器管理（增删改查）
- 预约审批列表
- 审批通过/拒绝按钮

---

## 五、错误码说明

| HTTP 状态码 | 说明 |
|------------|------|
| 200 | 成功 |
| 400 | 请求参数错误 / 业务逻辑错误 |
| 401 | 未认证（Token 无效或过期） |
| 403 | 无权限（需要管理员权限） |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 六、开发建议

1. **请求封装**: 建议封装 axios/fetch，统一处理 Token 和错误
2. **路由守卫**: 前端路由根据登录状态和角色进行权限控制
3. **角色菜单**: 根据 `user.role` 动态显示菜单项
4. **状态管理**: 可使用 Pinia/Vuex 或 React Context 管理用户状态

---

## 七、测试数据

后端启动后会自动创建以下测试数据：
- 分类：电子测量仪器、光学仪器、机械加工设备等
- 时段：第1-4节（08:00-18:00）

你可以先注册一个测试账号进行开发测试。
