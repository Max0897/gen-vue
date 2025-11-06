<template>
  <section class="form-demo">
    <a-card :bordered="false" class="form-demo__card">
      <template #title>
        <a-space align="center">
          <span>通用表单示例</span>
          <a-tag color="success">示例</a-tag>
        </a-space>
      </template>

      <a-form :model="formState" :rules="rules" layout="vertical" class="form-demo__form">
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="12" :lg="6">
            <a-form-item label="姓名" name="name" required>
              <a-input v-model:value="formState.name" placeholder="请输入姓名" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12" :lg="6">
            <a-form-item label="手机号" name="phone" required>
              <a-input v-model:value="formState.phone" placeholder="请输入手机号" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12" :lg="6">
            <a-form-item label="角色" name="role">
              <a-select v-model:value="formState.role" placeholder="请选择角色" allow-clear>
                <a-select-option value="admin">管理员</a-select-option>
                <a-select-option value="editor">编辑</a-select-option>
                <a-select-option value="viewer">访客</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12" :lg="6">
            <a-form-item label="状态" name="status">
              <a-radio-group v-model:value="formState.status">
                <a-radio value="enabled">启用</a-radio>
                <a-radio value="disabled">停用</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12" :lg="6">
            <a-form-item label="有效期" name="validRange">
              <a-range-picker v-model:value="formState.validRange" style="width: 100%" format="YYYY-MM-DD" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12" :lg="6">
            <a-form-item label="标签" name="tags">
              <a-select v-model:value="formState.tags" mode="tags" placeholder="请输入或选择标签" allow-clear>
                <a-select-option value="VIP">VIP</a-select-option>
                <a-select-option value="新客">新客</a-select-option>
                <a-select-option value="内部">内部</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="formState.remark" :rows="4" placeholder="请输入备注信息" show-count :maxlength="200" />
        </a-form-item>

        <div class="form-demo__actions">
          <a-space>
            <a-button @click="handleReset">重置</a-button>
            <a-button type="primary" :loading="submitting" @click="handleSubmit">
              提交
            </a-button>
          </a-space>
        </div>
      </a-form>
    </a-card>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { message } from 'ant-design-vue';

const submitting = ref(false);

const formState = reactive({
  name: '',
  phone: '',
  role: undefined,
  status: 'enabled',
  validRange: [],
  tags: [],
  remark: '',
});

const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度需为 2-20 个字符', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1\d{10}$/,
      message: '请输入正确的手机号',
      trigger: 'blur',
    },
  ],
};

const handleSubmit = () => {
  submitting.value = true;
  window.setTimeout(() => {
    submitting.value = false;
    message.success('提交成功（示例）');
  }, 600);
};

const handleReset = () => {
  Object.assign(formState, {
    name: '',
    phone: '',
    role: undefined,
    status: 'enabled',
    validRange: [],
    tags: [],
    remark: '',
  });
  message.info('已重置表单');
};
</script>

<style scoped lang="scss">
.form-demo__card {
  border-radius: 12px;
}

.form-demo__form {
  margin-top: 8px;
}

.form-demo__actions {
  margin-top: 24px;
  text-align: right;
}
</style>
