import { ProjectOutlined } from '@ant-design/icons';
import "./intro-sider.styles.css";

const IntroSider = () => {
    return (
      <div className='intro-div'>
        <ProjectOutlined style={{ fontSize: '50px', color: '#08c' }}/>
        <h1 className='name' style={{color: 'white'}}>Hi! My name is Camelia D. Brumar</h1>
        <p className='intro-text' style={{color: 'white'}}>I'm a PhD student in CS @ Tufts University.</p>
      </div>
    );
  };
  
  export default IntroSider;