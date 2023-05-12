import './post.scss';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Comments from './Comments';
import { useState, useContext } from 'react';
import { makeRequest } from '../axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../context/authContext.js';

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);

  // console.log('id!!!!!!!!!!!', currentUser.user_num);
  // console.log('id!!!!!!!!!!!', currentUser.user_id);

  const { isLoading, error, data } = useQuery(['likes', post.communityid], () =>
    makeRequest.get('/likes?postid=' + post.communityid).then((res) => {
      return res.data;
    })
  );

  //console.log('data2222: ', data);
  //console.log('data: ', data.length);

  //if (data.includes(currentUser.user_num) === true) console.log('INSIDE!!!!!');

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete('/likes?postid=' + post.communutyid);
      return makeRequest.post('/likes', { postid: post.communutyid });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['likes']);
      },
    }
  );

  const deleteMutation = useMutation(
    (postid) => {
      return makeRequest.delete('/posts/' + postid);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['posts']);
      },
    }
  );

  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.user_num));
  };

  const handleDelte = () => {
    deleteMutation.mutate(post.communityid);
  };

  return (
    <div className='post'>
      <div className='container'>
        <div className='user'>
          <div className='userInfo'>
            <img src={post.profilePic} alt='' />
            <div className='details'>
              <Link to={`/profile/${post.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <span className='name'>{post.name}</span>
              </Link>
              <span className='date'>{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userid === currentUser.user_num && <button onClick={handleDelte}>삭제</button>}
        </div>
        <div className='content'>
          <p>{post.desc}</p>
          <img src={'./upload/' + post.img} alt='' />
        </div>
        <div className='info'>
          <div className='item'>
            {isLoading ? ( //
              'loading'
            ) : data.includes(currentUser.user_num) ? (
              <FavoriteOutlinedIcon //
                style={{ color: 'red' }}
                onclick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data?.length} Likes
          </div>
          <div className='item' onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            12 Comments
          </div>
          <div className='item'>
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postid={post.communityid} />}
      </div>
    </div>
  );
};

export default Post;
