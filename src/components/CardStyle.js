import { cardAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys)

// define custom styles for funky variant
  const variants = {
  Networking: definePartsStyle({
    container: {
      borderColor: "red",
      borderWidth: "3px"
    }
  }),
  Alumni: definePartsStyle({
    container: {
        borderColor: "blue",
        borderWidth: "3px"
      }
  }),
  Company: definePartsStyle({
    container: {
        borderColor: "green",
        borderWidth: "3px"
      }
  }),
  
};

// export variants in the component theme
export const cardTheme = defineMultiStyleConfig({ variants });