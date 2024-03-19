import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useBreakpointValue,
} from '@chakra-ui/react'

interface Props {
  label: string;
  name: string;
  type: string;
  value: string | number | readonly string[] | undefined;
  options?: { value: string; label: string }[];
  onChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  isRequired?: boolean;
  disabled?: boolean;
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
}) => {
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

  return (
    <FormControl isRequired={isRequired}>
      <FormLabel htmlFor={name} {...formLabelStyle}>
        {label}
      </FormLabel>
      {type === 'select' ? (
        <Select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
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
          onChange={onChange}
          disabled={disabled}
          {...formInputStyle}
        />
      ) : (
        <Input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...formInputStyle}
        />
      )}
    </FormControl>
  )
}

export default FormField
