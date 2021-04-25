import { IconButton } from '@chakra-ui/button';
import { FiCornerLeftUp } from 'react-icons/fi';

export default function UnloadIconBtn(props) {
  const { clickhandler, ...rest } = props;
  return (
    <IconButton
      icon={<FiCornerLeftUp />}
      colorScheme='whiteAlpha'
      backgroundColor='#ffffff05'
      variant='outline'
      onClick={clickhandler}
      width={90}
      _focus={{ boxShadow: 'none' }}
      {...rest}
    />
  );
}