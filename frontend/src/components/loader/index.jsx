import React from 'react';
import { useSelector} from "react-redux"
import { Box, Layer, Text, Image } from 'grommet';
import Erik from "../../erik.svg"

export const Loader = () => {

    const usersLoading = useSelector((state) => state.user.loading);
    const countryLoading = useSelector((state) => state.country.loading);
    const topUsersLoading = useSelector((state) => state.topUsers.loading);
    const hashtagLoading = useSelector((state) => state.hashtagChart.loading);

  return (
      <>
      {(usersLoading || countryLoading || topUsersLoading || hashtagLoading) && (
        <Layer position="center">
             <Box align="center" direction="column" gap="small" pad="small" background="white">
                 <Image src={Erik}/>
                <Text>Loading...</Text>
            </Box>
        </Layer>
      )}
      </>
  );
};

