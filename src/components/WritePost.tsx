import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { postAdded } from "../features/postsSlice.ts";
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Textarea } from "@chakra-ui/react";
import React from "react";

/* 글 작성 */ 
const WritePost = () => {
        const dispatch = useDispatch();
        const history = useNavigate();

        const [content, setContent] = useState("");

        const {
            handleSubmit,
            register,
            formState: { errors, isSubmitting }
            } = useForm();

            const onSubmit = handleSubmit((data) => {
                dispatch(postAdded(data.content));

                history('/');
            });

            return (
                <Box p="10">
                    <form onSubmit={onSubmit}>
                        <FormControl isInvalid={!!errors.content}>
                            <FormLabel htmlFor="content"> 글 내용 </FormLabel>
                            <Textarea
                            id="content"
                            placeholder="무슨 생각을 하고 있나요?"
                            rows={30}
                            /* 빈 칸으로 두면 안 넘어가도록 */
                            {...register("content", {
                                required: "글 내용은 필수 항목입니다."
                            })}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            />
                            <FormErrorMessage>
                                {errors.content && errors.content.message as string}
                            </FormErrorMessage>
                        </FormControl>
                        <Button 
                        mt="4"
                        colorScheme="teal"
                        isLoading={isSubmitting}
                        type="submit"
                        > 작성 </Button>
                        <Link to = "/">
                            <Button
                            mt="4"
                            ml="3"
                            colorScheme="pink"
                            isLoading={isSubmitting}
                            type="button">
                                취소
                            </Button>
                        </Link>
                    </form>
                </Box>
            )
        }

export default WritePost;