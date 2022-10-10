import React, { useState } from 'react';
import { ActivityIndicator, List } from 'react-native-paper';
import { ScrollView } from 'react-native';
import { map, reject } from 'lodash/collection';
import { api } from '../services/api';

interface IActuality {
  _id: string
  name: string
  data: string
  updatedAt: Date
  updatedBy : {
    username: string,
    avatar: null | string,
    scope: ['user' | 'admin' | 'owner'],
    displayName: string
  }
}

interface IActualitySection {
  _id: string
  actualities: [IActuality]
  name: string
  updatedAt: Date
}

export function ActualityScreen() {
  const [expanded, setExpanded] = useState([]);
  const [actualities, setActualities] = useState(null);
  const [isLoading, setLoading] = useState(false);

  if (actualities === null && !isLoading) {
    setLoading(true);

    api.get('/getActualitiesSections')
      .then((data) => {
        setActualities(data.sections);
      })
      .catch(() => {
        // todo error
      })
      .finally(() => {
        setLoading(false);
      });
  }
  const handlePress = (sectionIndex) => {
    if (expanded.includes(sectionIndex))
      setExpanded(reject(expanded, (index) => index === sectionIndex));
    else
      setExpanded([...expanded, sectionIndex]);
  };

  return (
    <ScrollView>
      {
        isLoading
          ? <ActivityIndicator animating />
          : (
            <List.Section>
              {
                map(actualities, (section: IActualitySection, sectionIndex) => (
                  <List.Accordion
                    key={ sectionIndex }
                    title={ section.name }
                    left={ (props) => <List.Icon { ...props } icon="folder" /> }
                    expanded={ expanded.includes(sectionIndex) }
                    onPress={ () => handlePress(sectionIndex) }
                  >
                    {
                      map(section.actualities, (actuality: IActuality, actualityIndex) => (
                        <List.Item
                          key={ actualityIndex }
                          title={ actuality.name }
                        />
                      ))
                    }
                  </List.Accordion>
                ))
              }

            </List.Section>
          )
      }
    </ScrollView>
  );
}
