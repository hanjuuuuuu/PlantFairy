import Posts from '../components/Posts.jsx';
import Share from '../components/Share.jsx';

import '../design/community.scss';

const Community = () => {
  return (
    <div className='community'>
      <Share />
      <Posts />
    </div>
  );
};
export default Community;
