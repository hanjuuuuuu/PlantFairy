import { 
    Avatar, 
    Box, 
    Flex, 
    Text, 
    useColorModeValue, 
    VStack 
} from "@chakra-ui/react";
import Post from "../types/post";
import { trimContent } from "../utils/post";
import { getTimeAgo } from "../utils/date";
import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post }: {post: Post}) => {
return (
    <Link to={`/posts/${post.id}`}>
    {/* 세로 방향으로 컴포넌트 쌓이도록*/}
    <VStack
    spacing= "4"
    borderRadius="md"
    boxShadow="x1"
    padding="5"
    /* 숫자 낮으면 연함, 높으면 진함 */
    backgroundColor={useColorModeValue("gray.50", "gray.700")}
    >
        <Box width="100%">
            <Flex alignItems="flex-end" width= "100%" height="100%">
            <Avatar size="md" src={post.profileImageUrl} />
                <Box marginLeft= "3">
                    <Text as="h1" fontSize="1g" fontWeight="bold">
                        by Anonymous
                    </Text>
                    <Text as="p" fontSize="sm">
                          {getTimeAgo(post.timestamp)}
                    </Text>
                </Box>

            </Flex>
            </Box>
        <Text width="100%" fontSize="md" textAlign="left" whiteSpace="pre-wrap">
            {trimContent(post.content)}
        </Text>
    </VStack>    
    </Link>
);
};

export default PostCard;