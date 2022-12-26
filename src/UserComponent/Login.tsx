import React, {useState} from 'react';
import { Button, Form, Input,message,Checkbox } from 'antd';
import axios from 'axios';
const Login: React.FC = () => {
    const  BASE_URL = "http://localhost:5000"
    const [State,setState] = useState(0);

    const onFinish = (values: any) => {
      //login function and register function execute
      State === 0 ? axios.post(BASE_URL+"/user/login",values).then(res=>{
        if(res.data.role){
            localStorage.setItem("role",res.data.role)
            localStorage.setItem("email",res.data.email)
            message.success("Login success")
        }
        else{
            message.error("Invalid username/email or password")
        }
        
    }).catch((err)=>{
        alert("error occr when logging")
    })
    : axios.post(BASE_URL+"/user/signup",values).then((res)=>{
      message.success("register success")
      setState(0);
    }).catch(err =>{
      alert("error occr when logging")
    })
    };
  
    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };
    return (
      <div>
        <h1 style={{marginLeft:"60%"}}>{State === 0 ? "Login":"Register"}</h1>
        <Button onClick={()=>{
            State === 0 ? setState(1) : setState(0)
        }}>{State !== 0 ? "Login":"register"}</Button>
        <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        {State === 1 ? <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>:""}

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input />
        </Form.Item>
  
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
        {State === 1 ? <Form.Item
          label="Confirm Password"
          name="cpassword"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item> : ""}
  
        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
  
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" block >
        {State === 0 ? "Login":"register"}
        </Button>
        </Form.Item>
      </Form>
      </div>
      
    );
  };
  
  export default Login;