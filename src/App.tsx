import React, { useEffect , useState} from 'react';
import { Button, Form, Input,Tooltip ,Card,message,Spin,Tag,Modal} from 'antd';
import Login from '../src/UserComponent/Login'
import axios from 'axios';
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const  BASE_URL = "http://localhost:5000"

/* eslint-disable no-template-curly-in-string */
//set form validation with ant design
const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};
/* eslint-enable no-template-curly-in-string */

const App: React.FC = () => {
  const curruntUserEmail = localStorage.getItem("email");
  const curruntRole =  localStorage.getItem("role");
  const isAdmin =  curruntRole == "admin" ? true:false;
  const isLogging = !(curruntUserEmail && curruntRole) ? true:false;
  var isLoading = false;

  //  add some OOP concepts
   interface commentBase{
     _id : string
   }
   interface IPost extends commentBase{
    title:string
    description: string
    createdBy: string
    IsAdminApproved:boolean
    createdDate:Date
    Rejectedfeedback:string
    IsRejected:boolean
  }
  interface Icomment extends commentBase {
    description:string,
    createdBy : string,
    postId:string
  }
 
  const postsList: Array<IPost> = [];
  const commList : Array<Icomment> = [];

  const [approvedPost, setapprovedPost] = useState(postsList);
  const [des, setDescription] = useState("");
  const [rejId, setRejId] = useState("");
  const [serachText , setSearchTxt] = useState("");
  const [Rejectedfeedback, setRejectedfeedback] = useState("");
  const [comment , setComments] = useState(commList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectedModal, setisRejectedModal] = useState(false);
  const sharedProps = {
    defaultValue: curruntUserEmail?.toString(),
  };
  useEffect(()=>{
    //when loging user, check is normal user or admin, then redirect considering role
    //get all data for admin 
    if(isAdmin) {
      axios.get(BASE_URL+'/post').then((res)=>{
        setapprovedPost(res.data)
      }).catch(err =>{
       message.error("Data loading error")
      })
    }

    //get all post and assign to the list (only approved ones)
    else{
      axios.get(BASE_URL+'/post/public').then((res)=>{
        setapprovedPost(res.data)
      }).catch(err =>{
       message.error("Data loading error")
      })
    }
  });

  const showModal = (id:any) => {
    setIsModalOpen(true);
    axios.get(BASE_URL+'/comm/'+id).then(res =>{
        setComments(res.data);
    }).catch(err => console.log(err))
  };

  const rejectModalOpen = ()=>{
    setisRejectedModal(true);
  }

  const closeModal =()=>{
    setIsModalOpen(false);
    setisRejectedModal(false)
  }

  const clickRecId =(id:any) =>{
      setRejId(id);
  }

  //Post submite
  const onFinish = (values: any) => {
    isLoading = true;
    values.post.createdBy = curruntUserEmail;
    axios.post(BASE_URL+'/post',values.post).then((res)=>{
        if(res.data)
        {
          isLoading = false;
          message.success("Post created wating for the admin approval")
        }
    }).catch(err=>console.log(message.error(err)))
  };
  
  if(isLogging)
  {
     return(
       <div style={{margin:"10%",width:"50%"}}>
           <Login/>
       </div>
     );
  }
  else{
    return (
      <div>
       {/* search bar */}
      

        {/* Modal for comments */}
        <Modal title="Comments" open={isModalOpen} onOk={closeModal}>
          {comment.map(m =>{
              return  <p>{m.description}   created By {m.createdBy}</p>
          })}
      </Modal>
      
        <div className='header' style={{backgroundColor:'mediumpurple',height:"60px",position:'absolute',top:'-1px',width:'100%'}}>
           <h3 style={{color:"white"}}>Apple House    </h3>
           <h4 style={{color:"GrayText"}}>User Email : {curruntUserEmail}</h4>
           <Button onClick={()=>{
               localStorage.clear();
           }}>Logout</Button>
        </div>

        {/* Create post for both Admin and nomal users*/}
        <div style={{marginLeft:"400px"}}>
          <h1>Product Forum</h1>
          {isLoading ? <Spin tip="Post Creating" size="small"><div className="content" /></Spin> : "" }
          <Card title="Product Forum" style={{ width: "70%" }}>
          <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages} >
              <Form.Item name={['post', 'title']} label="Title" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name={['post', 'createdBy']} label="Email">
                <Input {...sharedProps} disabled/>
              </Form.Item>
              <Form.Item name={['post', 'description']} label="Description">
                <Input.TextArea />
              </Form.Item>
              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button type="primary" htmlType="submit" block >
                    Submit 
              </Button>
              </Form.Item>
            </Form>
            </Card>

           {/* If normal user Show all published post / If admin show all available post */}
            <h1>All Published Posts About Product</h1>
            <div>
            
            {/* search bar for find posts by user or text */}
            <Input.Group>
              <Input style={{ width: 'calc(100% - 200px)' }} onChange={(e)=>{
                  setSearchTxt(e.target.value);
              }}/>
            <Button type="primary" onClick={()=>{
                const a = approvedPost.filter(ab=>ab.createdBy === serachText)
                setapprovedPost(a);
            }}>Search by user or text</Button>
            </Input.Group>

          {/* Desplay all approved post and searched posts */}
          <Card size="small" title="Available Posts"  style={{ width: 500 }}>
          {approvedPost.filter(post =>{
             return post.createdBy.includes(serachText) || post.description.includes(serachText)
          }).map((post) =>{
                  return(

                    //Show who was comented for each post
                    <Card
                      style={{ marginTop: 16 }}
                      type="inner"
                      title={post.title + "| " + post.createdBy +"| "+ post.createdDate}
                      extra={<a onClick={()=>{
                        showModal(post._id);
                      }}>Comment</a>}
                     >
                      {post.description}
                      <div style={{marginTop:'5px'}}>
                      
                      {/* Is admin and not approved, he can approve each and evry post created by user*/}
                      {isAdmin && !post.IsAdminApproved ? <Button onClick={()=>{
                            post.IsAdminApproved = true;
                            axios.put(BASE_URL+'/post/'+post._id,post).then((res)=>{
                                message.success("Approved by Admin")
                            }).catch((error)=>{
                              message.error("Try again")
                            }).finally(()=>{})
                      }} type="primary">Approve</Button> : isAdmin ? <Tag color="green">Approved</Tag> : ""}

                      {/* Is admin and approved, he can reject each and evry post created by user*/}
                      {isAdmin && !post.IsRejected ? <Button type="primary" danger onClick={()=>{
                              rejectModalOpen();
                              clickRecId(post._id);
                      }}>Reject</Button> : isAdmin ?<Tag color="green">rejected</Tag> : ""}


                    {/* when admin reject some post he need to add some reject feedback */}
                    <Modal title="Notice for rejection" open={isRejectedModal} onOk={closeModal}>
                      <Input.Group compact>
                          <Input onChange={(e)=>{
                              setRejectedfeedback(e.target.value)
                          }}
                              style={{ width: 'calc(100% - 200px)' }}
                              
                          />
                          <Tooltip title="Rejection">
                            <Button onClick={()=>{
                               post.IsAdminApproved = false;
                               post.Rejectedfeedback = Rejectedfeedback
                               axios.put(BASE_URL+'/post/'+rejId,post).then((res)=>{
                                  message.error("Rejected")
                                  closeModal();
                              }).catch((error)=>{
                                message.error("Try again")
                              }).finally(()=>{
                                  
                              })
                            }} >Send</Button>
                          </Tooltip>
                      </Input.Group>
                    </Modal>

                      {/* If need to delete approved post only post creater can remove it*/}
                      {post.IsAdminApproved && post.createdBy == curruntUserEmail  ? <Button type="primary" danger onClick={()=>{
                          axios.delete(BASE_URL+'/post/'+post._id).then((res)=>{
                              if(res.data._id){
                                 message.success("Deleted post")
                              }
                          }).catch((err)=>{console.log("error"); message.error("ERR")})
                      }}>Remove</Button> :""}

                      {/* Each person can comment their post or other's post*/}
                      <Input.Group compact>
                          <Input onChange={(e)=>{
                              setDescription(e.target.value)
                          }}
                              style={{ width: 'calc(100% - 200px)' }}
                              
                          />
                          <Tooltip title="Comment">
                            <Button onClick={()=>{
                               const payload = {
                                   "description":des,
                                   "createdBy":curruntUserEmail,
                                   "postId":post._id
                               }
                               axios.post(BASE_URL+'/comm',payload).then((res)=>{
                                     if(res.data){
                                       message.success("Comments added");
                                     }
                               })
                            }} >Comment</Button>
                          </Tooltip>
                      </Input.Group>
                      </div>
                    </Card>
                  )
          })}
          </Card>
        </div>
        </div>
        </div>
      );
  }
  
};

export default App;