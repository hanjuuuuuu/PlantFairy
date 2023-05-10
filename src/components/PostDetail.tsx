import { Avatar, Box, Button, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Post from "../types/post";
import React from "react";
import { getTimeAgo } from "../utils/date";

const PostDetail = () => {
    const { postId } = useParams();

    const post: Post = useSelector((state: any) => state.posts.find((post: Post) => post.id === postId));

    if (!post) {
        return <Text as = "p"> 요청하신 글을 찾을 수 없습니다. </Text>;
    }

    return (
        <Box boxShadow="lg" minHeight="fit-content" m="10" maxWidth="container.xl" margin="auto">
            <Flex direction="column">
                <Box>
                    <Flex 
                        alignItems="flex-end"
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        backgroundColor={useColorModeValue(
                            "blackAlpha.400",
                            "blackAlpha.600"
                        )}
                        width= "100%"
                        height="100%"
                        padding="8"
                        >
                            <Avatar size="lg" src={post.profileImageUrl} />
                            <Box marginLeft="6">
                                <Text as="h1" fontSize="lg" fontWeight="bold">
                                    by Anonymous
                                </Text>
                                <Text as="p" fontSize="large" lineHeight="1.5">
                                    {getTimeAgo(post.timestamp)}
                                </Text>
                            </Box>
                        </Flex>
                </Box>

                <Box
                w="100%"
                margin="auto"
                padding="8"
                // eslint-disable-next-line react-hooks/rules-of-hooks
                backgroundColor={useColorModeValue(
                    "white",
                    "gray.700"
                )}
                > 
                <Text as="p" whiteSpace="pre-wrap">
                    {post.content}
                </Text>
                <Flex justify="space-between">
                    <Box> {/* 나중에 뭔가 추가할 자리 */} </Box>
                    <Link to = "/">
                        <Button marginTop="8" colorScheme="whatsapp">
                            Back to list
                        </Button>
                    </Link>
                </Flex>
            </Box>
        </Flex>
    </Box>
    )
};

export default PostDetail;