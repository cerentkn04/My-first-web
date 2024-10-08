import classes from './MyAccountSideBar.module.css';

const MyAccSideBar = ({ pageToLoad }) => {
  return (
    <div className={classes.sidebar}>
      <button onClick={() => pageToLoad('Settings')}>Settings</button>
      <button onClick={() => pageToLoad('Social')}>Social</button> 
      <button onClick={() => pageToLoad('Library')}>Library</button>
      <button onClick={() => pageToLoad('My Activity')}>My Activity</button> 
    </div>
  );
}

export default MyAccSideBar;