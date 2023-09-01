import { useContext, useState } from 'react';
import './comments.scss';
import { AuthContext } from '../context/authContext.js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../axios.js';
import moment from 'moment';
import axios from 'axios';

const Comments = ({ postid }) => {
  const [desc, setDesc] = useState('');
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(['comments'], () =>
    makeRequest.get('/comments?postid=' + postid).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      return makeRequest.post('/comments', newComment);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['comments']);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postid });
    setDesc('');
  };

  return (
    <div className='comments'>
      <div className='write'>
        <img src={currentUser.profilePic} alt='' />
        <input type='text' placeholder='write a comment' value={desc} onChange={(e) => setDesc(e.target.value)} />
        <button onClick={handleClick}>Send</button>
      </div>
      {isLoading
        ? 'loading'
        : error
        ? 'Error'
        : data &&
          data.map((comment) => (
            <div className='comment'>
              <img src={comment.profilePicture} alt='' />
              <div className='info'>
                {<span>{comment.user_nickname}</span>}
                <p>{comment.desc}</p>
              </div>
              <span className='date'>{moment(comment.createdAt).fromNow()}</span>
            </div>
          ))}
    </div>
  );
};

export default Comments;
