import React from 'react'
import { Toast, ToastBody, ToastContainer } from 'react-bootstrap'
const ToastComp = ({
  bg= 'dark',
  content,
  delay =3000,
  position,
  setShow,
  show,
  title
}) => {
  return (
    <ToastContainer
    containerPosition='fixed'
    position={position}
    className='p-3'
    >
      <Toast 
      autohide
      bg={bg}
      delay={delay}
      onClose={()=>setShow(false)}
      show={show}
      >
        <Toast.Header closeButton={false}>
      <strong className='me-auto'>
      {title}
      </strong>
        </Toast.Header>
        <ToastBody className='text-white'>
        {content}
        </ToastBody>
      </Toast>
    </ToastContainer>
  )
}

export default ToastComp