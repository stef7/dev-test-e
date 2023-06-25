import React, { useMemo, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Input,
  Box,
} from "@chakra-ui/react";
import { useDebounce } from "react-use";
import { CrimeDataResponseBody, CrimeDataRowAny } from "~/pages/api/crime-data";
import { AccordionOptional } from "./accordion";
import useSWRImmutable from "swr/immutable";

import styles from "./table.module.css";

export const EndpointData: React.FC<{ endpoint: string }> = ({ endpoint }) => {
  const [date, setDate] = useState<string>();
  const [dateDebounced, setDateDebounced] = useState<string>();
  useDebounce(() => setDateDebounced(date), 1000, [date]);
  const [offencesBy, setOffencesBy] = useState<keyof CrimeDataRowAny>();

  const params = useMemo(
    () =>
      new URLSearchParams({
        ...(offencesBy ? { offencesBy } : {}),
        ...(dateDebounced ? { date: dateDebounced } : {}),
      }).toString(),
    [dateDebounced, offencesBy],
  );
  const {
    data: { data, keys, allKeys } = {},
    isLoading,
  } = useSWRImmutable(
    ["endpointData", endpoint, params],
    async ([, endpoint, params]) => {
      const response = await fetch(`${endpoint}?${params}`);
      return response.json() as Promise<CrimeDataResponseBody>;
    },
    { keepPreviousData: true },
  );

  /** Memoise rendering to improve performance */
  const header = useMemo(
    () => (
      <Thead pos="sticky" zIndex="docked" bg="var(--chakra-colors-chakra-body-bg)">
        <Tr>
          {keys?.map((key, colIndex) =>
            key === "_id" ? null : (
              <Th
                key={`${colIndex}: ${key}`}
                scope="col"
                pos="relative"
                _after={{
                  content: '""',
                  h: "1px",
                  w: "full",
                  pos: "absolute",
                  left: 0,
                  bottom: 0,
                  bgColor: "var(--chakra-colors-chakra-border-color)",
                }}
              >
                {key}
              </Th>
            ),
          )}
        </Tr>
      </Thead>
    ),
    [keys],
  );

  const rows = useMemo(
    () =>
      data?.map((row, rowIndex) => ({
        data: row,
        element: (
          <Tr key={`${rowIndex}: ${row._id}`}>
            {keys?.map((key, colIndex) =>
              key === "_id" ? null : (
                <Td key={`${colIndex}: ${key}`} aria-label={key}>
                  {String(row[key])}
                </Td>
              ),
            )}
          </Tr>
        ),
      })),
    [data, keys],
  );

  const [groupBy, setGroupBy] = useState<keyof CrimeDataRowAny>("Suburb - Incident");

  const groups = useMemo(
    () =>
      rows &&
      Array.from(
        rows.reduce((map, row) => {
          const groupByValue = row.data[groupBy];
          map.get(groupByValue)?.push(row) ?? map.set(groupByValue, [row]);
          return map;
        }, new Map<typeof rows[number]["data"][typeof groupBy], typeof rows>()),
      ),
    [rows, groupBy],
  );

  return (
    <Flex direction="column" minH="100vh" pos="relative">
      <Flex
        wrap="wrap"
        pos="sticky"
        bottom={0}
        zIndex="banner"
        bgColor="var(--chakra-colors-chakra-subtle-bg)"
        borderTopWidth={1}
        padding={5}
        paddingY={3}
        gap={3}
        order={2}
      >
        <FormControl w="fit-content">
          <FormLabel fontSize="sm">Filter by date</FormLabel>
          <Input
            size="sm"
            placeholder="(none)"
            type="date"
            onInput={(ev) => setDate(ev.currentTarget.value)}
            value={date}
          />
        </FormControl>

        <FormControl w="fit-content">
          <FormLabel fontSize="sm">Offences by</FormLabel>
          <Select
            size="sm"
            onInput={(ev) => setOffencesBy(ev.currentTarget.value)}
            placeholder={groupBy ? "unset 'Group by' to enable" : "(none)"}
            value={groupBy ? undefined : offencesBy}
            isDisabled={!!groupBy}
          >
            {allKeys?.map((key) =>
              key === "_id" || key === "Offence count" ? null : <option key={key}>{key}</option>,
            )}
          </Select>
        </FormControl>

        <FormControl w="fit-content">
          <FormLabel fontSize="sm">Group by</FormLabel>
          <Select
            size="sm"
            onInput={(ev) => setGroupBy(ev.currentTarget.value)}
            placeholder={offencesBy ? "unset 'Offences by' to enable" : "(none)"}
            value={offencesBy ? undefined : groupBy}
            isDisabled={!!offencesBy}
          >
            {allKeys?.map((key) => (key === "_id" ? null : <option key={key}>{key}</option>))}
          </Select>
        </FormControl>
      </Flex>

      <Box pos="relative" flexGrow={1}>
        {isLoading ? (
          <Spinner margin={6} />
        ) : !groups ? (
          <Box margin={6}>Error loading data.</Box>
        ) : !groups.length ? (
          <Box margin={6}>No data to display.</Box>
        ) : (
          <AccordionOptional>
            {groups?.map(([groupByValue, rows], index) => {
              const buttonText = `${groupByValue} (${rows.length})`;
              return {
                groupByValue,
                buttonText,
                key: `${index}: ${buttonText}`,
                node: (
                  <Table className={styles["table"]}>
                    {header}
                    <Tbody fontSize="sm">{rows.map((row) => row.element)}</Tbody>
                  </Table>
                ),
              };
            })}
          </AccordionOptional>
        )}
      </Box>
    </Flex>
  );
};
