import React from "react";
import PostCard from './components/PostCard.tsx';
import Post from './types/post.ts';
import { Box, Text, Grid, GridItem, Button } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Routes, Route, Link } from "react-router-dom";
import PostDetail from './components/PostDetail.tsx';
import WritePost from "./components/WritePost.tsx";

function App() {
  const posts: Post[] = useSelector((state: any) => state.posts);

  const orderedPost = posts
  .slice()
  .sort((a: Post, b: Post) => b.timestamp.localeCompare(a.timestamp));

  return (
    <Routes>
      <Route
      path ="/"
      element={
      <Box  
      maxWidth="container.xl"
      margin="auto">
            <Text 
            fontSize="xxx-large"
            fontWeight="extrabold"
            textAlign="center"
            marginTop="9"
            > 
            식물요정 커뮤니티
            </Text>
            <Link to = "/posts/new">
              <Button ml="10" colorScheme="whatsapp">
                새 글 작성
              </Button>
            </Link>
            <Button ml="5" colorScheme="pink">
                글 삭제
              </Button>
            <Grid gridTemplateColums={["1fr"]} 
            gridGap="10" 
            padding="10" 
            >
              { orderedPost.map((post: Post) => (
                  <GridItem key ={post.id}>
                  <PostCard post={post} />
                  </GridItem>
            ))}
      </Grid>
    </Box>
  }
  />
  <Route path="/posts/:postId" element={<PostDetail />} />
  <Route path="/posts/new" element={<WritePost />} />
  </Routes>
  );
}

export default App;