import {
  Box,
  Flex,
  Spacer,
  Tag,
  TagLabel,
  Avatar,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { AiOutlineUser } from "react-icons/ai";
import { ChevronDownIcon } from "@chakra-ui/icons";
import logo from "../../assets/image 2.png";
import { Link, useNavigate } from "react-router-dom"; // Import Link for routing
import { Button } from "../ui/button";
import PropTypes from 'prop-types';
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/AuthenticationSlice";



const Navbar = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const LogOut = () => {
    dispatch(logout())
    navigate("/login")
  }
  return (
    <Box as="nav" bg="#252525" px={4} py={2} shadow="md" className="max-h-[58px]">
      <Flex alignItems="center">
        {/* Left: Logo */}
        <Box>
          <img src={logo} alt="Company Logo" width={250} height={35} style={{ height: "40px" }} />
        </Box>
        <Spacer />
        {/* Right: Tag, Avatar, and Dropdown */}
        <Flex alignItems="center" gap={4}>
          {/* Tag */}
          <Tag size="lg" className="bg-white" borderRadius="full">
            <TagLabel>Admin</TagLabel>
          </Tag>
          {/* Avatar */}
          <Avatar bg="white" size="sm" icon={<AiOutlineUser fontSize="1rem"  className="text-black" />} />
          {/* Dropdown Menu */}
          <Menu>
            <MenuButton>
              <Icon as={ChevronDownIcon} color="white"  className="text-white" w={8} h={8} />
            </MenuButton>
            <MenuList>
                <MenuItem>
                  <Link to="/analytics">Analytics</Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/exports">Exports Center</Link>
                </MenuItem>
                <MenuItem>       
                  <Button onClick={()=>{LogOut()}} className="bg-[#404040] w-full m-auto hover:bg-[#404040] hover:opacity-85">LogOut</Button>
                </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
};


Navbar.propTypes = {
  tagContent: PropTypes.string.isRequired,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Navbar;
