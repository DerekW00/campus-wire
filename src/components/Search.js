import { useState, useEffect } from 'react';
import { SearchIcon } from '@chakra-ui/icons';
import { Box, Flex, Heading, Input, Button, Text, Badge, IconButton,
         useToast, Modal, ModalOverlay, ModalContent, ModalHeader,
        ModalCloseButton,ModalBody, useDisclosure } from '@chakra-ui/react';
import { auth, database } from '../services/firebase';
import { ref, get, child, push } from 'firebase/database';
import { Image } from '@chakra-ui/image';

function formatDateAndTime(dateTimeString) {
  const options = { month: 'long', day: 'numeric' };
  const formattedDate = new Date(dateTimeString).toLocaleDateString('en-US', options);

  const timeOptions = { hour: 'numeric', minute: 'numeric' };
  const formattedTime = new Date(dateTimeString).toLocaleTimeString('en-US', timeOptions);

  return `${formattedDate} @ ${formattedTime}`;
}

function Search() {
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const dbRef = ref(database);
    get(child(dbRef, 'events/'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const snap = snapshot.val();
          const dataArray = Object.values(snap);
          dataArray.sort((a, b) => new Date(a.Time) - new Date(b.Time));
          setData(dataArray);
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const addToFavorites = (eventData) => {
    if (!user) {
      console.log('You need to sign in first.');
      return;
    }

    push(child(ref(database), `user-favorites/${user.uid}`), eventData)
      .then(() => {
        toast({
          title: 'Event added to Favorites.',
          description: "You'll receive a reminder 10 minutes before the event.",
          status: 'info',
          duration: 9000,
          isClosable: true,
          position: 'top',
        });
      })
      .catch((error) => {
        console.error('Error adding event to favorites:', error);
      });
  };

  const getColorByType = (eventType) => {
    switch (eventType) {
      case 'Networking':
        return 'blue';
      case 'Alumni':
        return 'green';
      case 'Company Visit':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const handleSearch = () => {
    // Perform search based on searchQuery
    const searchResults = data.filter((event) =>
      event.Title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setData(searchResults);
  };

  return (
    <Box>
      <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img style={{ width: '70%' }} src='campuswave.png' alt='campuswave' />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '360px' }}>
          <Box maxH="78vh" overflowY="scroll">
            {data.map((item) => (
              <div>
                <Box
                  maxW='md'
                  w='340px'
                  variant='outline'
                  key={item.Title}
                  p="4"
                  onClick={() => {
                    setSelectedEvent(item);
                    onOpen(); // Open the modal
                  }}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  <div>
                    <Badge colorScheme={getColorByType(item.Type)}>{item.Type}</Badge>
                    <div style={{ height: '10px' }}></div>
                    <Heading size='sm'>{item.Title}</Heading>
                    <Text>
                      📍 {item.Location}
                      <br />
                      📅 {formatDateAndTime(item.Time)}
                    </Text>
                  </div>
                  <div style={{ width: '30px', borderLeft: '30px' }}></div>
                  <Image
                    objectFit="cover"
                    src="thumbnail.png"
                    alt="Chakra UI"
                    style={{ flexShrink: 0, width: '100px', height: '130px', borderRadius:'15px', right: 0  }} 
                  />
                </Box>
                <div style={{ height: '20px' }}></div>
              </div>
            ))}
          </Box>
          <Modal size='xs' onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{selectedEvent ? selectedEvent.Title : ''}</ModalHeader>
              <ModalCloseButton />
              {selectedEvent && (
                <ModalBody>
                  <Image
                    objectFit='cover'
                    src='thumbnail.png'
                    alt='Chakra UI'
                    boxSize="100px"
                  />
                  <div style={{ height: '10px' }}></div>
                  <Box>
                    <Badge colorScheme={getColorByType(selectedEvent.Type)}>{selectedEvent.Type}</Badge>
                    <div style={{ height: '10px' }}></div>
                    <Heading size='sm'>{selectedEvent.Title}</Heading>
                    <Text>
                      📍 {selectedEvent.Location}
                      <br />
                      📅 {formatDateAndTime(selectedEvent.Time)}
                    </Text>
                  </Box>
                  <Text>{selectedEvent.Description}</Text>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Button
                      onClick={() => addToFavorites(selectedEvent)}
                      colorScheme={getColorByType(selectedEvent.Type)}
                    >
                      Add to Favorites
                    </Button>
                  </div>
                </ModalBody>
              )}
              <div style={{ height: '18px' }}></div>
            </ModalContent>
          </Modal>
        </div>
      </div>
      <div style={{ width: '340px',  display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', bottom: 50, left: 25, right: 0 }}>
        <Flex align="center" w='340px' mb='4'>
            <Input
              flex="1"
              placeholder="Search by event title             "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div style={{ width: '10px' }}></div>
            <IconButton onClick={handleSearch} aria-label='Search database' icon={<SearchIcon />} />
        </Flex>
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
        <Flex justify="space-between" align="center" padding="10px">
            <a href='/CreateEvent'><img src='add.png' alt='create new event'/></a>
            <a href='/Chat' ><img src='chat.png' alt='chat'/></a>
            <a href='/Home'><img src='home.png' alt='home'/></a>
            <a href='/Account'><img src='person.png' alt='person'/></a>
            <a href='/Search'><img src='search.png' alt='search'/></a>
        </Flex>
      </div>
    </Box>
  );
}

export default Search;


