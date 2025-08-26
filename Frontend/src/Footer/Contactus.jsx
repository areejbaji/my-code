// import React from 'react';
//  import "./Contactus.css";
 
//  const ContactForm = () => {
//    return (
//      <div className="contact-form-container">
//        <h1 className="form-title">Contact Us</h1>
//        <form className="contact-form">
//          <div className="form-group">
//            <label htmlFor="name">Name</label>
//            <input type="text" id="name" className="form-input" />
//          </div>
         
//          <div className="form-group">
//            <label htmlFor="email">Email <span className="required">*</span></label>
//            <input type="email" id="email" className="form-input" required />
//          </div>
         
//          <div className="form-group">
//            <label htmlFor="phone">Phone number</label>
//            <input type="tel" id="phone" className="form-input" />
//          </div>
         
//          <div className="form-group">
//            <label htmlFor="comment">Comment</label>
//            <textarea id="comment" className="form-textarea" rows="4"></textarea>
//          </div>
         
//          <button type="submit" className="submit-btn">Send</button>
//        </form>
//      </div>
//    );
//  };
 
//  export default ContactForm;
import React from 'react';
 import "./Contactus.css";
 import { useNavigate } from 'react-router-dom';
 
 const ContactForm = () => {
   const navigate = useNavigate();
   return (
    <div>
      <button onClick={() => navigate(-1)} className="back-button">← Back</button>

     <div className="contact-form-container">
      
       <h1 className="form-title">Contact Us</h1>
       <form className="contact-form">
         <div className="form-group">
           <label htmlFor="name">Name</label>
           <input type="text" id="name" className="form-input" />
         </div>
         
         <div className="form-group">
           <label htmlFor="email">Email <span className="required">*</span></label>
           <input type="email" id="email" className="form-input" required />
         </div>
         
         <div className="form-group">
           <label htmlFor="phone">Phone number</label>
           <input type="tel" id="phone" className="form-input" />
         </div>
         
         <div className="form-group">
           <label htmlFor="comment">Comment</label>
           <textarea id="comment" className="form-textarea" rows="4"></textarea>
         </div>
         
         <button type="submit" className="submit-btn">Send</button>
       </form>
     </div>
     </div>
   );
 };
 
 export default ContactForm;