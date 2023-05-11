import Post from './Post';
import './posts.scss';
import { makeRequest } from '../axios';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const Posts = () => {
  const { isLoading, error, data } = useQuery(['posts'], () =>
    makeRequest.get('/posts').then((res) => {
      return res.data;
    })
  );

  console.log(data);
  return (
    <div className='posts'>
      {error //
        ? 'Something went wrong!'
        : isLoading
        ? 'loading'
        : data.map((post) => <Post post={post} key={post.id} />)}
    </div>
  );
};

export default Posts;
