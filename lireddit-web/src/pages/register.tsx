import React from 'react'
import { Formik, Form } from "formik"
import { FormControl, FormLabel, Input, FormErrorMessage, Box, Button } from '@chakra-ui/react'
import { Wrapper } from '../components/Wrapper'
import { InputField } from '../components/InputField'
import { useMutation } from 'urql'
interface registerProps {

}

const REGISTER_MUT = `mutation register($username : String!, $password: String!) {
  Register(options: {username: $username, password: $password})
  {
    user{
      id
    	username
    }
    errors{
      field
      message
    }
  }
}
`


export const Register: React.FC<registerProps> = ({ }) => {
  const [, register] = useMutation(REGISTER_MUT)
  return (
    <Wrapper variant='small'>
      <Formik initialValues={{ username: '', password: '' }} onSubmit={(values) => { register(values) }}>
        {({ isSubmitting }) => (
          <Box mt={4}>
            <Form>
              <InputField name='username' placeholder='username' label='username'></InputField>
              <InputField name='password' placeholder='Password' label='Password' type='password'></InputField>
              <Button mt={4} type='submit' isLoading={isSubmitting}> Register</Button>
            </Form>
          </Box>

        )}
      </Formik>
    </Wrapper>
  )
}

export default Register