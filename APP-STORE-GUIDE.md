# 应用商店发布指南

> 最后更新：2025年12月
>
> 信息来源：[Apple Developer](https://developer.apple.com/programs/)、[Google Play Console](https://support.google.com/googleplay/android-developer/)
>
> **构建流程**请参考：[BUILD-AND-RELEASE.md](./BUILD-AND-RELEASE.md)

---

## ⚠️ 重要提醒：应用名称一致性

**在开始发布前，请确保以下名称保持一致：**

| 位置 | 配置/设置 | 显示位置 |
|------|----------|----------|
| `app.json` → `name` | 项目配置 | **设备主屏幕**上显示的名称 |
| App Store Connect | 商店配置 | **App Store** 中显示的名称 |
| Google Play Console | 商店配置 | **Google Play** 中显示的名称 |

**踩坑经验：** 如果 `app.json` 中的 `name`（如 `pomodoro-timer`）与商店名称（如 `Zenmodoro`）不一致，会导致：
- **App Store 审核被拒**（Guideline 2.3.8 - Accurate Metadata）
- **Google Play Production Access 被拒**

**解决方案：** 在项目初期就确定最终应用名称，在 `app.json` 中直接使用：
```json
{
  "expo": {
    "name": "Zenmodoro",  // ← 使用最终名称，不要用临时名称
    "slug": "zenmodoro"
  }
}
```

---

## 1️⃣ 开发者账号注册

### 1.1 Apple Developer Program（iOS 发布必需）

**费用：** $99 美元/年

**官方链接：** https://developer.apple.com/programs/enroll/

**注册步骤：**

1. **准备材料**
   - Apple ID（建议使用专门的开发者账号，需开启双重认证）
   - 有效的信用卡或借记卡
   - 法定姓名（Apple Account 中的姓名必须是真实姓名，不能使用别名或公司名）
   - 如果是公司账号：D-U-N-S 编号

2. **注册流程**
   ```
   1. 访问 https://developer.apple.com/programs/enroll/
   2. 点击 "Start Your Enrollment"
   3. 使用 Apple ID 登录
   4. 选择账号类型：
      - Individual（个人）- 适合独立开发者
      - Organization（组织）- 需要 D-U-N-S 编号
   5. 填写个人/公司信息
   6. 同意协议并支付年费
   7. 等待审核
   ```

3. **审核时间**
   - 个人账号：通常 24-48 小时
   - 组织账号：3-5 个工作日
   - 如需 D-U-N-S 编号或额外验证：7-10 天

4. **审核通过后（Expo/EAS 项目）**

   使用 EAS 可以**自动完成**证书和配置，无需手动操作：

   ```bash
   # 1. 确保已登录 EAS
   eas login

   # 2. 首次构建时，EAS 会自动引导配置
   eas build --platform ios
   ```

   **首次运行时按提示操作：**
   - 输入 Apple ID 和密码登录
   - 选择 **"Let EAS handle it"** 让 EAS 自动管理证书
   - EAS 会自动创建 App ID、Distribution Certificate、Provisioning Profile

   **手动查看/管理凭证：**
   ```bash
   eas credentials --platform ios
   ```

**会员权益：**
- App Store 发布权限
- TestFlight 内测分发
- 每月 25 小时 Xcode Cloud 计算时间
- 每个应用最高 1PB iCloud 存储

**注意事项：**
- 个人账号：应用显示你的真实姓名作为卖家名称
- 组织账号：需要 D-U-N-S 编号，必须有法律授权代表签约
- 年费到期需续费，否则应用将下架
- 可申请费用减免（非营利组织、教育机构、政府机构）

---

### 1.2 Google Play Console（Android 发布必需）

**费用：** $25 美元（一次性）

**官方链接：** https://play.google.com/console/signup

**注册步骤：**

1. **准备材料**
   - Google 账号
   - 有效的信用卡或借记卡（不接受预付卡）
   - 政府签发的身份证明文件
   - 联系电话和邮箱
   - 如果是组织账号：D-U-N-S 编号

2. **注册流程**
   ```
   1. 访问 https://play.google.com/console/signup
   2. 使用 Google 账号登录
   3. 选择账号类型：
      - 个人开发者
      - 组织/公司
   4. 填写开发者信息
   5. 同意开发者协议
   6. 支付 $25 注册费
   7. 完成身份验证
   ```

3. **身份验证要求（2024年起强制）**

   **个人账号需要提供：**
   - 政府签发的身份证明
   - 联系电话（供 Google 联系）
   - 开发者邮箱（供用户联系）
   - Android 设备验证（通过 Play Console 移动应用）

   **组织账号需要提供：**
   - 组织法定名称和地址
   - D-U-N-S 编号（9位唯一标识）
   - 组织验证文件
   - 联系电话和邮箱

4. **处理时间**
   - 注册处理：最多 5 天
   - 首次发布应用审核可能更长

5. **注册完成后**
   - 登录 Google Play Console: https://play.google.com/console/
   - 创建应用
   - 配置服务账号（用于自动提交）

**配置服务账号（用于 EAS Submit）：**

```bash
# 1. 在 Google Cloud Console 创建服务账号
#    https://console.cloud.google.com/

# 2. 创建 JSON 密钥文件并下载

# 3. 在 Google Play Console 中授权服务账号
#    设置 → API 访问 → 关联项目 → 添加服务账号

# 4. 将密钥文件放在项目目录（添加到 .gitignore）
#    例如：./google-service-account.json

# 5. 在 eas.json 中配置
"android": {
  "serviceAccountKeyPath": "./google-service-account.json"
}
```

**服务费用（付费应用/内购）：**
- 前 $100万/年：15% 服务费
- 超过 $100万：30% 服务费
- 订阅类应用：首日起 15%

**注意事项：**
- 注册费一次性，终身有效
- 2024年起所有开发者必须完成身份验证
- 未完成验证的账号和应用可能被移除
- 2026年起将要求所有 Android 应用开发者验证身份（包括非 Play 商店分发）

---

### 1.3 Expo 账号（EAS Build/Submit 必需）

**费用：** 免费（付费计划可选）

**官方链接：** https://expo.dev/signup

**注册步骤：**

```bash
# 1. 访问 https://expo.dev/signup 注册

# 2. 或通过命令行注册
npx expo register

# 3. 登录
eas login
```

**免费计划限制：**
- 每月 30 次构建
- 队列优先级较低（可能需要等待 30-60 分钟）

**付费计划（可选）：**
- Production: $99/月 - 无限构建，优先队列
- Enterprise: 联系销售

**本地构建方案（免费替代）：**

如果不想等待 EAS 云端队列，可以使用本地构建：

```bash
# iOS 本地构建（需要 macOS + Xcode + Fastlane）
eas build --platform ios --local

# Android 本地构建（需要 Android Studio + JDK）
eas build --platform android --local
```

**本地构建环境要求：**
- **iOS**：macOS、Xcode、Fastlane (`brew install fastlane`)
- **Android**：Android Studio、Android SDK、Java JDK

---

## 2️⃣ 商店材料准备

### 2.1 应用图标

| 平台 | 尺寸 | 格式 | 最大文件大小 | 说明 |
|------|------|------|-------------|------|
| iOS | 1024x1024 | PNG | - | 不能有透明度、不能有圆角（系统自动处理） |
| Android | 512x512 | PNG (32位，带 alpha) | 1024 KB | 提供完整正方形，系统自动应用圆角遮罩 |

**Android 图标设计规范：**
- 不要在图标中包含排名、价格、分类等误导性徽章或文字
- 图标应是启动器图标的高保真版本
- 可以有透明区域用于阴影等效果

**生成图标：**
```bash
# 使用项目中的图标生成脚本
node scripts/generate-icons.js

# 或使用在线工具
# https://appicon.co/
# https://makeappicon.com/
```

---

### 2.2 应用截图

#### iOS 截图尺寸

> **⚠️ 重要：** App Store 要求特定分辨率的截图，不是所有模拟器都能生成符合要求的截图！

**6.5 英寸 iPhone 截图（必需）：**

App Store 接受的分辨率：`1242 × 2688` 或 `1284 × 2778`

| 模拟器设备 | 分辨率 | 是否符合要求 |
|-----------|--------|-------------|
| iPhone 12 Pro Max | 1284 × 2778 | ✅ 符合 |
| iPhone 13 Pro Max | 1284 × 2778 | ✅ 符合 |
| **iPhone 14 Plus** | 1284 × 2778 | ✅ **推荐** |
| iPhone 14 Pro Max | 1290 × 2796 | ❌ 不符合 |
| iPhone 15/16 Pro Max | 1320 × 2868 | ❌ 不符合 |

**踩坑经验：** iPhone 14 Pro Max 及更新的 Pro Max 机型分辨率已改变，截图会被 App Store 拒绝！请使用 **iPhone 14 Plus** 或 **iPhone 13 Pro Max** 模拟器。

**12.9/13 英寸 iPad 截图（必需）：**

App Store 接受的分辨率：`2048 × 2732` 或 `2064 × 2752`

| 模拟器设备 | 分辨率 | 是否符合要求 |
|-----------|--------|-------------|
| iPad Pro 12.9" (1-4代) | 2048 × 2732 | ✅ 符合 |
| **iPad Pro 13" (M4)** | 2064 × 2752 | ✅ **推荐** |

**在 Xcode 中添加模拟器：**
1. Xcode → **Window** → **Devices and Simulators**
2. 点击 **Simulators** 标签 → 左下角 **+**
3. 选择 **iPhone 14 Plus** 或 **iPhone 13 Pro Max**

**iOS 截图要求：**
- 格式：.jpeg、.jpg 或 .png
- 数量：1-10 张
- 分辨率：72 dpi，RGB，无透明度
- 截图快捷键：在模拟器中按 **Cmd + S**

#### Android 截图尺寸

| 类型 | 尺寸要求 | 数量 | 说明 |
|------|---------|------|------|
| 手机 | 最小 1080px 宽，9:16 或 16:9 | 2-8 张 | **必需** |
| 7" 平板 | 最小 1200 x 1920 (竖屏) | 最多 8 张 | 可选 |
| 10" 平板 | 最小 1600 x 2560 (竖屏) | 最多 8 张 | 可选 |
| Wear OS | 384 x 384 (1:1) | 至少 1 张 | 仅手表应用需要 |

**Android 截图要求：**
- 格式：JPEG 或 24位 PNG（无 alpha）
- 最大文件大小：8 MB/张
- 长边不能超过短边的 2 倍
- 截图应展示真实 UI，不要使用误导性视觉效果
- 文字不应超过截图面积的 20%
- 避免使用"最佳"、"第一"、"新"、"免费"等促销词汇

**截图最佳实践：**
- 展示核心功能（计时器、统计、设置）
- 使用真实数据，不要空白页面
- 保持风格一致
- 反映应用最新状态

---

### 2.3 功能图片（Google Play 必需）

| 规格 | 值 |
|------|-----|
| 尺寸 | 1024 x 500 像素 |
| 格式 | JPEG 或 24位 PNG（无 alpha） |
| 最大文件大小 | 1 MB |

**设计要点：**
- 避免在边缘放置重要元素（会被裁切）
- 不要重复使用应用图标的品牌元素
- 不要包含排名、奖项、用户评价、价格等信息
- 用作视频预览的封面和广告

---

### 2.4 应用描述

**App Store（iOS）：**

| 字段 | 限制 | 说明 |
|------|------|------|
| 应用名称 | 30 字符 | 简洁有力 |
| 副标题 | 30 字符 | 补充说明 |
| 关键词 | 100 字符 | 逗号分隔，用于搜索 |
| 描述 | 4000 字符 | 详细功能介绍 |
| 更新说明 | 4000 字符 | 版本更新内容 |

**Google Play（Android）：**

| 字段 | 限制 | 说明 |
|------|------|------|
| 应用名称 | 30 字符 | 简洁有力 |
| 简短描述 | 80 字符 | 一句话介绍 |
| 详细描述 | 4000 字符 | 详细功能介绍 |

**示例描述（中文）：**

```
番茄时钟 - 简约专注计时器

一款简洁优雅的番茄工作法计时器，帮助你保持专注，提高效率。

【核心功能】
• 经典番茄工作法（25分钟工作 + 5分钟休息）
• 实时统计和进度追踪
• 智能通知提醒
• 自定义时长设置
• 深色模式支持
• 自动开始下一个番茄
• 完全离线可用
• 数据本地存储，保护隐私

【适合人群】
• 备考学生
• 程序员和设计师
• 需要专注工作的职场人士
• 任何想要提高效率的人

简单。专注。高效。
```

**示例描述（英文）：**

```
Pomodoro Timer - Simple & Elegant

A clean and focused Pomodoro timer to help you stay productive and manage your time effectively.

FEATURES:
• Classic Pomodoro Technique (25 min work + 5 min break)
• Long break after 4 sessions (15 min)
• Real-time statistics and progress tracking
• Smart notifications when sessions end
• Customizable work and break durations
• Dark mode support
• Auto-start next session
• Complete offline functionality
• Your data stays on your device - 100% privacy

PERFECT FOR:
• Students studying for exams
• Developers and designers
• Remote workers
• Anyone who needs focused work time

Simple. Focused. Efficient.
```

**示例宣传文本（Promotional Text，可选）：**

```
Stay focused, work smarter. A simple Pomodoro timer to boost your productivity.
```

**示例关键词（Keywords）：**

```
pomodoro,timer,focus,productivity,time management,study,work,concentration,task,tomato
```

---

### 2.5 Support URL 和 Privacy Policy URL

**两个 URL 的区别：**

| URL | 用途 | 是否必填 |
|-----|------|---------|
| Support URL | 用户寻求帮助、反馈问题的页面 | 必填 |
| Privacy Policy URL | 隐私政策声明页面 | 必填 |

**推荐做法（使用 GitHub 仓库）：**

```
Support URL:        https://github.com/XavierZhao1989/pomodoro-timer
Privacy Policy URL: https://github.com/XavierZhao1989/pomodoro-timer/blob/main/PRIVACY.md
```

---

### 2.6 隐私政策

**为什么需要：**
- App Store 和 Google Play 都要求提供隐私政策 URL
- 即使不收集任何数据也需要声明

**内容要点：**
1. 收集哪些数据（如果有）
2. 如何使用数据
3. 是否与第三方共享
4. 数据存储位置
5. 用户权利（删除、导出等）
6. 联系方式

**托管方式：**
- GitHub Pages（免费）
- 自己的网站
- 第三方服务：[Termly](https://termly.io/)、[iubenda](https://www.iubenda.com/)

**示例隐私政策模板：**

```markdown
# 隐私政策 / Privacy Policy

最后更新：2025年1月1日

## 数据收集

番茄时钟应用不收集任何个人信息。所有数据（包括计时记录和设置）
都存储在您的设备本地，不会上传到任何服务器。

## 第三方服务

本应用不使用任何第三方分析或广告服务。

## 数据安全

您的数据仅存储在您的设备上。卸载应用将删除所有数据。

## 联系我们

如有问题，请联系：your-email@example.com
```

---

### 2.6 其他材料

**视频预览（可选）：**
- iOS：15-30 秒，展示核心功能
- Android：可以添加 YouTube 视频链接

**类别选择：**
- iOS：生产力（Productivity）
- Android：工具 > 生产力

**年龄分级：**
- iOS：4+（无限制内容）
- Android：所有人（Everyone）

---

## 2.7 iOS 完整发布流程（Expo/EAS）

> 以下是 Apple Developer 审核通过后，使用 Expo/EAS 发布 iOS 应用的完整流程。

### 步骤 1：EAS 登录和项目关联

```bash
# 登录 EAS（如已登录会提示）
eas login

# 查看当前登录账号
eas whoami

# 如需切换账号，先登出
eas logout
eas login
```

**首次使用或切换账号时，关联项目：**
```bash
# 初始化/关联项目到当前 EAS 账号
eas init

# 如果项目已关联其他账号，需要强制重新初始化
# 先删除 app.json 中的 extra.eas.projectId，然后运行：
eas init
```

关联成功后，`app.json` 会自动添加：
```json
{
  "extra": {
    "eas": {
      "projectId": "your-project-id"
    },
    "owner": "your-eas-username"
  }
}
```

---

### 步骤 2：首次构建 iOS 应用

```bash
eas build --platform ios
```

**构建过程中的交互提示：**

1. **Bundle Identifier 设置**
   ```
   ✔ What would you like your iOS bundle identifier to be?
   → 输入如：com.yourname.appname
   ```

2. **加密声明**
   ```
   ✔ iOS app only uses standard/exempt encryption?
   → 选择 yes（大多数应用选 yes，除非使用了自定义加密）
   ```

3. **Apple ID 登录**
   ```
   ✔ Do you want to log in to your Apple account?
   → 选择 yes
   ✔ Apple ID: → 输入你的 Apple ID
   ✔ Password: → 输入密码
   ```

4. **双重认证**
   ```
   ✔ Please enter the 6 digit code you received at +86 ••• •••• ••XX:
   → 输入手机收到的验证码
   ```

5. **证书生成**
   ```
   ✔ Generate a new Apple Distribution Certificate? → yes
   ✔ Generate a new Apple Provisioning Profile? → yes
   ```

6. **推送通知配置**
   ```
   ✔ Would you like to set up Push Notifications for your project?
   → 选择 Yes（如果应用需要推送通知）
   ✔ Generate a new Apple Push Notifications service key? → yes
   ```

**构建完成后输出：**
```
✔ Build finished

🍏 iOS app:
https://expo.dev/artifacts/eas/xxxxx.ipa
```

---

### 步骤 3：提交到 App Store Connect

```bash
# 提交最新构建到 App Store Connect
eas submit --platform ios --latest
```

**EAS Submit 会自动完成：**
- ✅ 注册 Bundle Identifier
- ✅ 在 App Store Connect 创建应用（无需手动创建）
- ✅ 创建 TestFlight 测试组
- ✅ 生成 App Store Connect API Key
- ✅ 上传构建到 TestFlight

**首次提交时的交互提示：**
```
✔ Apple ID: → 输入 Apple ID
› Restoring session...
› Team YOUR_NAME (TEAM_ID)
✔ Bundle identifier registered com.yourname.appname
✔ Prepared App Store Connect for your-app
✔ TestFlight group created
✔ Generate a new App Store Connect API Key? → yes
✔ Submitted your app to Apple App Store Connect!
```

**注意：** 如果应用名已被占用，EAS 会自动生成临时名称（如 `app-name (abc123)`），可以稍后在 App Store Connect 修改。

**提交成功后输出：**
```
ASC App ID:    6756425363
Build:         1.0.0 (1)

Your binary has been successfully uploaded to App Store Connect!
```

构建会出现在 App Store Connect 的 TestFlight 中（处理需要 5-10 分钟）。

---

### 步骤 4：App Store Connect 完善信息

> EAS Submit 已自动创建应用，现在需要完善详细信息。

登录 https://appstoreconnect.apple.com/

#### 4.1 修改应用名称（如需要）

如果 EAS 生成了临时名称：
1. 进入应用 → **App 信息**
2. 修改 **名称** 为你想要的名称（如：番茄时钟）
3. 点击 **存储**

#### 4.2 填写应用信息

**App 信息页面：**
- **名称**：应用名称
- **副标题**：简短描述（30 字符内）
- **类别**：生产力
- **内容版权**：否
- **年龄分级**：点击设置 → 全部选"无" → 获得 4+ 分级

**定价和可用性：**
- **价格**：免费
- **可用性**：选择发布地区

**隐私政策：**
- 填写隐私政策 URL（必填）

#### 4.3 准备提交版本

在 **iOS App** 页面：

1. **截图上传**
   - 6.9" 显示屏（iPhone 15 Pro Max）：至少 2 张
   - 或 6.5" 显示屏：至少 2 张
   - 尺寸：1320 x 2868 (6.9") 或 1284 x 2778 (6.5")

2. **应用描述**
   - 宣传文本（可选，170 字符）
   - 描述（必填，4000 字符内）
   - 关键词（100 字符，逗号分隔）
   - 支持 URL
   - 营销 URL（可选）

3. **构建版本**
   - 点击 **"+"** 选择已上传的构建
   - 如未显示，等待几分钟处理

4. **App 审核信息**
   - 登录信息：如无需登录选"不需要登录"
   - 联系信息：填写审核联系人信息
   - 备注（可选）

#### 4.4 App 隐私

在 **App 隐私** 页面：
- 如果应用不收集任何数据，选择 **"不收集数据"**
- 如果收集数据，如实填写数据类型

---

### 步骤 5：提交审核

1. 检查所有信息填写完整
2. 点击右上角 **"添加以供审核"**
3. 确认提交信息
4. 点击 **"提交至 App 审核"**

**审核时间：**
- 通常 24-48 小时
- 首次提交可能稍长
- 可在 App Store Connect 查看审核状态

---

### 步骤 6：发布

审核通过后：
- **手动发布**：在 App Store Connect 中点击"发布此版本"
- **自动发布**：如果选择了自动发布，审核通过后自动上架
- **定时发布**：可以设置具体发布日期

---

### 常见问题

**Q: 构建失败怎么办？**
```bash
# 查看详细日志
eas build:view [BUILD_ID]

# 清除凭证重试
eas credentials --platform ios
```

**Q: 提交失败提示 Bundle ID 已存在？**
- 确保在 App Store Connect 中的 Bundle ID 与构建时设置的一致
- 如果是其他开发者占用，需要换一个 Bundle ID

**Q: 如何更新已发布的应用？**
```bash
# 1. 更新版本号（app.json 中的 version）
# 2. 重新构建
eas build --platform ios

# 3. 提交新版本
eas submit --platform ios --latest

# 4. 在 App Store Connect 填写更新说明，提交审核
```

---

## 3️⃣ 提交到应用商店

### 3.1 提交到 App Store（iOS）

> 完整流程请参考 [2.7 iOS 完整发布流程](#27-ios-完整发布流程expoeas)

**快速命令：**

```bash
# 构建
eas build --platform ios

# 提交
eas submit --platform ios --latest
```

---

### 3.2 提交到 Google Play（Android）

> **重要：** 首次提交必须手动上传，之后可以使用 EAS Submit 自动提交。

#### 步骤 1：构建 Android 应用

```bash
eas build --platform android
```

构建完成后会生成 `.aab` 文件链接。

#### 步骤 2：配置 Google Service Account（首次需要）

用于 EAS Submit 自动提交，配置步骤：

1. **Google Cloud Console** (https://console.cloud.google.com/)
   - 创建或选择项目
   - 启用 **Google Play Android Developer API**
   - 创建 **Service Account**
   - 生成 **JSON 密钥**并下载

2. **Google Play Console** (https://play.google.com/console/)
   - Settings → API access → Link Google Cloud 项目
   - 授权 Service Account 权限（Admin 或 Release manager）

3. **项目配置**
   ```bash
   # 将 JSON 密钥放到项目根目录
   mv ~/Downloads/xxx.json ./google-service-account.json

   # 添加到 .gitignore（重要！不要提交到 Git）
   echo "google-service-account.json" >> .gitignore
   ```

#### 步骤 3：首次手动上传

**首次提交必须手动完成：**

1. 下载构建的 `.aab` 文件
2. Google Play Console → **Internal testing** → **Create new release**
3. 上传 `.aab` 文件
4. 填写 Release notes（版本说明）
5. 保存并发布

#### 步骤 4：后续版本自动提交

首次手动上传后，之后可以使用：

```bash
eas submit --platform android --latest
```

#### Google Play Console 配置清单

**创建应用时：**
- App name：应用名称
- Default language：English (United States)
- App or game：App
- Free or paid：Free

**Store settings：**
- **Tags**：选择相关标签（Productivity, Timer, Focus 等，最多 5 个）
- **Target age**：13+, 16+, 18+（不选 12 岁以下避免儿童政策）

**Main store listing：**
- Short description（80 字符）
- Full description（4000 字符）
- App icon（512x512）
- **Feature graphic（1024x500）** - **必需**
- Phone screenshots（至少 2 张）

**App content：**
- Privacy policy URL
- App access：All functionality available
- Ads：No ads
- Content rating：填写问卷
- Target audience：选择年龄组
- News app：No
- Data safety：填写数据收集声明

**Internal testing：**
- 创建测试人员邮件列表
- 上传 AAB 构建
- 发布到测试轨道

---

### 3.3 Google Play 封闭测试（新个人账号必需）

> **⚠️ 重要：** 2023年11月13日后创建的**个人开发者账号**必须完成封闭测试才能申请 Production Access！

#### 封闭测试要求

| 要求 | 说明 |
|------|------|
| 测试人员数量 | 至少 **12 人** |
| 测试时长 | 连续 **14 天** opt-in |
| 测试人员要求 | 必须有 Android 设备 + Google Play |

#### 测试人员需要做什么

| 必须做 | 不需要做 |
|--------|----------|
| ✅ 通过测试链接 opt-in 加入测试 | ❌ 不需要评分 Rating |
| ✅ 从 Google Play 下载安装（不能 sideload） | ❌ 不需要公开评价 |
| ✅ 实际使用应用 1-2 分钟 | ❌ 不需要每天打开 |
| ✅ 保持 opt-in 状态 14 天 | |

#### 封闭测试流程

1. **创建封闭测试轨道**
   - Google Play Console → Testing → Closed testing
   - 创建测试人员邮件列表（Email lists 或 Google Groups）

2. **上传 AAB 并发布**
   - Upload → 上传 AAB 文件
   - 填写 Release name 和 Release notes
   - Start rollout to Closed testing

3. **获取测试链接并邀请测试人员**
   ```
   https://play.google.com/apps/testing/com.yourname.appname
   ```

4. **等待 14 天**
   - 测试人员 opt-in 后开始计算
   - 期间可以上传新版本（不影响计时）

5. **申请 Production Access**
   - 14 天后在 Dashboard 申请
   - Google 审核通常需要 7 天

#### 常见问题

**Q: 测试期间可以更新应用吗？**
A: 可以，上传新版本不会影响 14 天计时，测试人员会自动收到更新。

**Q: 测试人员卸载应用会影响计数吗？**
A: 不会，只有通过测试链接点击 "Leave the test" 才会退出。

**Q: 如何找到 12 个测试人员？**
- 朋友和家人（需要有 Google Play 的 Android 设备）
- 开发者社区（V2EX、Reddit 等）
- 付费测试服务（如 [Testers Community](https://www.testerscommunity.com/)）

#### Production Access 被拒常见原因

| 原因 | 解决方案 |
|------|----------|
| 测试人员不足 12 人 | 确保至少 12 人 opt-in |
| 测试人员参与度不够 | 确保测试人员实际使用应用 |
| 14 天不连续 | 不要暂停测试轨道 |
| 应用名称不一致 | 确保 app.json name 与商店名称一致 |
| 应用质量问题 | 检查 Pre-launch report，修复问题 |

---

## 4️⃣ 审核流程

### 4.1 App Store 审核

**审核时间：** 24-48 小时（首次可能更长）

**常见拒绝原因及解决方案：**

| 原因 | 解决方案 |
|------|----------|
| 隐私政策不完整 | 确保隐私政策 URL 可访问，内容完整 |
| 崩溃或严重 bug | 充分测试后再提交 |
| 功能描述不准确 | 确保描述与实际功能匹配 |
| 使用私有 API | 检查代码，移除不允许的 API 调用 |
| 元数据问题 | 检查截图、描述是否符合规范 |
| 最低功能要求 | 确保应用有足够的功能和价值 |

**审核指南：** https://developer.apple.com/app-store/review/guidelines/

---

### 4.2 Google Play 审核

**审核时间：** 2-7 天（首次可能更长）

**常见拒绝原因及解决方案：**

| 原因 | 解决方案 |
|------|----------|
| 目标 API 级别过低 | 更新 targetSdkVersion |
| 权限说明不清楚 | 在描述中说明为什么需要某些权限 |
| 内容分级不正确 | 重新填写分级问卷 |
| 数据安全声明不完整 | 完善数据收集声明 |
| 截图包含误导性内容 | 使用真实 UI 截图 |

**政策中心：** https://play.google.com/console/about/guides/

---

## 5️⃣ 发布和更新

### 5.1 发布选项

**App Store：**
- **手动发布**：审核通过后手动点击发布
- **自动发布**：审核通过后自动发布
- **定时发布**：指定日期时间发布

**Google Play：**
- **立即发布**：审核通过后立即发布给所有用户
- **分阶段发布**（推荐）：
  - 先发布给 20% 用户
  - 观察 24-48 小时
  - 逐步增加到 100%

---

### 5.2 版本更新

**语义化版本号：**
- `1.0.0` → `1.0.1` - Bug 修复
- `1.0.0` → `1.1.0` - 新功能
- `1.0.0` → `2.0.0` - 重大更新

**更新流程：**

```bash
# 1. 更新版本号
# 编辑 app.json 和 package.json

# 2. 提交代码
git add .
git commit -m "chore: bump version to 1.1.0"
git tag v1.1.0
git push origin main --tags

# 3. 构建新版本
eas build --platform all

# 4. 提交到商店
eas submit --platform all --latest

# 5. 填写更新说明
# 6. 提交审核
```

---

## 6️⃣ 上架检查清单

### 账号准备
- [ ] Apple Developer Program 已注册并激活（$99/年）
- [ ] Google Play Console 已注册并完成身份验证（$25 一次性）
- [ ] Expo 账号已登录

### 商店材料
- [ ] 应用图标 - iOS: 1024x1024 PNG（无透明）
- [ ] 应用图标 - Android: 512x512 PNG（带 alpha，<1MB）
- [ ] 功能图片 - Android: 1024x500（必需）
- [ ] iPhone 截图 - 6.9" 或 6.5"（至少 2 张）
- [ ] Android 截图 - 最小 1080px 宽（至少 2 张）
- [ ] 应用名称（中英文，≤30 字符）
- [ ] 简短描述（≤80 字符）
- [ ] 详细描述（≤4000 字符）
- [ ] 关键词（≤100 字符，逗号分隔）
- [ ] 隐私政策 URL 可访问
- [ ] 支持邮箱/网站

### 提交前检查
- [ ] 版本号已更新
- [ ] 所有功能正常
- [ ] 无 console.log 输出
- [ ] TypeScript 编译通过
- [ ] 真机测试通过

### 提交
- [ ] iOS Production Build 完成
- [ ] Android Production Build 完成
- [ ] iOS 已提交到 App Store Connect
- [ ] Android 已提交到 Google Play Console
- [ ] 商店信息填写完整
- [ ] 已提交审核

---

## 有用资源

### 官方文档
- [App Store 审核指南](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect 截图规格](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/)
- [Google Play 政策中心](https://play.google.com/console/about/guides/)
- [Google Play 图标设计规范](https://developer.android.com/distribute/google-play/resources/icon-design-specifications)
- [Google Play 预览素材](https://support.google.com/googleplay/android-developer/answer/9866151)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)

### 工具链接
- [App Store Connect](https://appstoreconnect.apple.com/)
- [Google Play Console](https://play.google.com/console/)
- [Apple Developer](https://developer.apple.com/)
- [Google Cloud Console](https://console.cloud.google.com/)

### 隐私政策生成器
- [Termly](https://termly.io/)
- [iubenda](https://www.iubenda.com/)
- [PrivacyPolicies.com](https://www.privacypolicies.com/)

