import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from "react-router-dom";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { login } from "@/redux/slices/AuthenticationSlice";
import AuthLayout from "@/components/components/authLayout";
import loginImage from "@/assets/oxbridgeAI.jpeg";

const JudgeLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Login Failed",
        description: "Please provide both email and password.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await dispatch(login({ 
        credentials: { email, password },
        pathname: location.pathname 
      })).unwrap();
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/judge/dashboard");
    } catch (err) {
      toast({
        title: "Login Failed",
        description: err.message || "Please check your credentials and try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleLogin();
    }
  };

  return (
    <AuthLayout imageUrl={loginImage}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          Judge Login
        </Text>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </FormControl>
        <Button
          color="white"
          bg="black"
          _hover={{ bg: "gray.800" }}
          size="lg"
          width="100%"
          onClick={handleLogin}
          isLoading={loading}
        >
          Log In
        </Button>
        {error && (
          <Text color="red.500" fontSize="sm" textAlign="center">
            {error}
          </Text>
        )}
      </VStack>
    </AuthLayout>
  );
};

export default JudgeLogin;