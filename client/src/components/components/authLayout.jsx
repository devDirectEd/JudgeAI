// eslint-disable-next-line no-unused-vars
import { Box, Flex, Image, Text, Link, Input, Button, VStack, FormControl, FormLabel } from "@chakra-ui/react";
import PropTypes from 'prop-types';

const AuthLayout = ({ children, imageUrl }) => {
  return (
    <Flex height="100vh">
      {/* Left Half - Image */}
      <Box flex="1" display={{ base: "none", md: "block" }}>
        <Image
          src={imageUrl}
          alt="Authentication Page Image"
          objectFit="cover"
          width="100%"
          height="100%"
        />
      </Box>
      {/* Right Half - Form */}
      <Box
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        padding={{ base: 4, md: 8 }}
      >
        <Box width="100%" maxWidth="400px">
          {children}
        </Box>
      </Box>
    </Flex>
  );
};
AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

export default AuthLayout;
