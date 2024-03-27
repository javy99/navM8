import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Textarea,
  useBreakpointValue,
  VisuallyHiddenInput,
  useTheme,
  Text,
  Box,
  Flex,
  InputRightElement,
} from '@chakra-ui/react'
import { ReactNode } from 'react'
import { BsCameraFill, BsXCircleFill } from 'react-icons/bs'
import Button from './Button'

interface Props {
  label?: string
  name: string
  type: string
  value?: string | number | readonly string[] | undefined
  options?: { value: string; label: string }[]
  onChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void
  isRequired?: boolean
  disabled?: boolean
  icon?: ReactNode
  multiple?: boolean
  selectedFiles?: File[]
  onRemoveFile?: (index: number, name: string) => void | undefined
  sx?: any
  placeholder?: string
  color?: string
  mb?: number
  buttonLabel?: string
  onButtonClick?: () => void
  isLoading?: boolean
}

const FormField: React.FC<Props> = ({
  label,
  name,
  type,
  value = '',
  onChange,
  options = [],
  isRequired = true,
  disabled,
  icon,
  multiple,
  selectedFiles,
  onRemoveFile,
  sx,
  placeholder,
  color,
  mb,
  buttonLabel,
  onButtonClick,
  isLoading,
}) => {
  const theme = useTheme()
  const primaryColor = theme.colors.primary
  const whiteColor = theme.colors.white

  const formFontSize = useBreakpointValue({
    base: 'sm',
    md: 'md',
    xxl: 'lg',
  })

  const formPaddingX = useBreakpointValue({ base: 4, md: 6 })
  const formInputHeight = useBreakpointValue({
    base: '2.5rem',
    xl: '3rem',
  })

  const formLabelStyle = {
    color: '#000',
    fontWeight: 'bold',
    fontSize: formFontSize,
  }

  const formInputStyle = {
    boxShadow: 'inset 0 0 2px 2px rgba(0, 0, 0, 0.2)',
    borderRadius: '0.9375rem',
    height: formInputHeight,
    variant: 'unstyled',
    px: formPaddingX,
    _focus: {
      borderBottom: '0.25rem solid #0B6B78',
    },
    fontSize: formFontSize,
    cursor: 'pointer',
  }

  const formSelectStyle = {
    boxShadow: 'inset 0 0 2px 2px rgba(0, 0, 0, 0.2)',
    borderRadius: '0.9375rem',
    variant: 'styled',
    height: formInputHeight,
    _focus: {
      borderBottom: '0.25rem solid #0B6B78',
    },
    fontSize: formFontSize,
    cursor: 'pointer',
  }

  // Custom styling for file input wrapper
  const fileInputWrapperStyle = {
    boxShadow: 'inset 0 0 2px 2px rgba(0, 0, 0, 0.2)',
    borderRadius: '0.9375rem',
    variant: 'unstyled',
    fontSize: formFontSize,
    cursor: 'pointer',
    alignItems: 'center',
    display: 'flex',
    gap: '2rem',
    justifyContent: 'space-between',
    padding: '0.5rem',
  }

  return (
    <FormControl isRequired={isRequired} mb={mb}>
      <FormLabel htmlFor={name} {...formLabelStyle}>
        {label}
      </FormLabel>
      {type === 'select' ? (
        <Select
          id={name}
          name={name}
          value={value}
          disabled={disabled}
          onChange={onChange}
          {...formSelectStyle}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : type === 'textarea' ? (
        <Textarea
          id={name}
          name={name}
          value={value}
          disabled={disabled}
          onChange={onChange}
          {...formInputStyle}
        />
      ) : type === 'file' ? (
        <InputGroup style={fileInputWrapperStyle}>
          {icon && (
            <InputLeftElement pointerEvents="none">{icon}</InputLeftElement>
          )}
          <Button
            htmlFor={name}
            disabled={disabled}
            color={primaryColor}
            border={`2px solid ${primaryColor}`}
            height={formInputHeight}
            bg={whiteColor}
            _hover={{
              bg: whiteColor,
            }}
            cursor="pointer"
            as="label"
            width="120px"
            borderRadius="0.9375rem"
            flexShrink={0}
            px={2}
          >
            Upload{' '}
            <BsCameraFill
              color={primaryColor}
              size={18}
              style={{ marginLeft: '0.5rem' }}
            />
          </Button>
          <VisuallyHiddenInput
            id={name}
            name={name}
            type="file"
            onChange={onChange}
            multiple={multiple}
          />
          <Box display="flex" flexWrap="wrap">
            {selectedFiles?.map((file, index) => (
              <Flex key={file.name} alignItems="center" mr={2}>
                <Text fontSize="sm" mr={1}>
                  {file.name}
                </Text>
                <BsXCircleFill
                  cursor="pointer"
                  size={20}
                  color="#a3a3a3"
                  onClick={() => onRemoveFile && onRemoveFile(index, name)}
                />
              </Flex>
            ))}
          </Box>
        </InputGroup>
      ) : type === 'inputButton' ? (
        <InputGroup display="flex" alignItems="center">
          <Input
            id={name}
            name={name}
            type="text"
            value={value}
            onChange={onChange}
            disabled={disabled}
            sx={sx}
            placeholder={placeholder}
            color={color}
            {...formInputStyle}
          />
          <InputRightElement width="auto" mr={1} mt={1}>
            <Button isLoading={isLoading} onClick={onButtonClick}>
              {buttonLabel}
            </Button>
          </InputRightElement>
        </InputGroup>
      ) : (
        <InputGroup display="flex" alignItems="center">
          {icon && (
            <InputLeftElement
              display="flex"
              alignItems="center"
              pointerEvents="none"
              height={formInputHeight}
            >
              {icon}
            </InputLeftElement>
          )}
          <Input
            type={type}
            id={name}
            name={name}
            value={value}
            disabled={disabled}
            onChange={onChange}
            sx={sx}
            placeholder={placeholder}
            color={color}
            {...formInputStyle}
          />
        </InputGroup>
      )}
    </FormControl>
  )
}

export default FormField
