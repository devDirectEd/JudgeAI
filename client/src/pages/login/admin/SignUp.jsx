import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Link,
  useToast,
} from "@chakra-ui/react";
import { signup } from "@/redux/slices/AuthenticationSlice";
import AuthLayout from "../../../components/components/authLayout";
import signUpImage from "../../../assets/oxbridgeAI.jpeg";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Remove confirmPassword before sending to API
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...signupData } = formData;
      
      await dispatch(signup(signupData)).unwrap();
      
      toast({
        title: "Account created",
        description: "You have successfully signed up!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/admin/login");
    } catch (err) {
      console.log(err)
      toast({
        title: "Signup Failed",
        description: error || "Please check your information and try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <AuthLayout imageUrl={signUpImage}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <Text fontSize="2xl" fontWeight="bold" textAlign="center">
            Sign Up
          </Text>
          <FormControl isRequired>
            <FormLabel>Full Name</FormLabel>
            <Input 
              placeholder="Enter your full name" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input 
              type="email" 
              placeholder="Enter your email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              placeholder="Confirm your password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </FormControl>
          {error && (
            <Text color="red.500" fontSize="sm" textAlign="center">
              {error}
            </Text>
          )}
          <Button 
            type="submit" 
            color='white' 
            bg="black"
            _ _hover={{ bg: "gray.800" }}
            size="lg" 
            width="100%"
            isLoading={loading}
            loadingText="Signing up..."
          >
            Sign Up
          </Button>
          <Text fontSize="sm" textAlign="center">
            Already have an account?{" "}
            <Link as={RouterLink} to="/admin/login" color="blue.500">
              Log in
            </Link>
          </Text>
        </VStack>
      </form>
    </AuthLayout>
  );
};

export default Signup;