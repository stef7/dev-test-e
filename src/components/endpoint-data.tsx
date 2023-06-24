import { useMemo, useState } from "react";
import { useAsync } from "react-use";
import { CrimeDataResponseBody } from "~/pages/api/crime-data";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tfoot,
  Select,
  FormControl,
  FormLabel,
  Flex,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

const CollapsibleRowGroup = <R extends Record<string, string>>({
  groupingValue,
  rows,
  keys,
}: {
  groupingValue: string | null;
  rows: R[];
  keys: (keyof R & string)[];
}) => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: !groupingValue });

  return (
    <Tbody>
      <Tr display={groupingValue !== null ? undefined : "none"}>
        <Th scope="col" colSpan={keys.length + 1}>
          <Button onClick={onToggle} display="inline-flex" gap={3}>
            {`${isOpen ? "▼" : "►"} ${groupingValue} (${rows.length})`}
          </Button>
        </Th>
      </Tr>
      {rows.map((row, rowIndex) => (
        <Tr key={rowIndex} display={isOpen ? undefined : "none"}>
          <Td display={groupingValue !== null ? undefined : "none"} />
          {keys.map((key, colIndex) =>
            colIndex ? (
              <Td key={`${colIndex}: ${key}`}>{row[key]}</Td>
            ) : (
              <Th key={key} scope="row">
                {row[key]}
              </Th>
            ),
          )}
        </Tr>
      ))}
    </Tbody>
  );
};

export const EndpointData: React.FC<{ endpoint: string }> = ({ endpoint }) => {
  const [groupBy, setGroupBy] = useState("Suburb - Incident");
  const data = useAsync(async () => {
    const response = await fetch(`${endpoint}?${new URLSearchParams(groupBy ? { groupBy } : {})}`);
    const result: CrimeDataResponseBody = await response.json();
    if ("error" in result) throw new Error(result.error);
    return result;
  }, [endpoint, groupBy]);

  const keys = useMemo(() => {
    const rows = data.value && "groupBy" in data.value ? Object.values(data.value.groups).flat() : data.value;
    return rows && [...new Set(rows.flatMap((row) => Object.keys(row)))];
  }, [data.value]);

  const entries = useMemo(
    () => data.value && ("groupBy" in data.value ? Object.entries(data.value.groups) : ([[null, data.value]] as const)),
    [data.value],
  );

  return (
    <Table>
      <Thead pos="sticky" top={0} zIndex="docked" bgColor="Background">
        <Tr>
          <Th scope="col" display={groupBy ? undefined : "none"}>
            Group
          </Th>
          {keys?.map((key, colIndex) => (
            <Th key={`${colIndex}: ${key}`} scope="col">
              {key}
            </Th>
          ))}
        </Tr>
      </Thead>
      {(keys && (
        <>
          {entries?.map(([groupingValue, rows]) => (
            <CollapsibleRowGroup key={groupingValue} {...{ groupingValue, rows, keys }} />
          ))}
          <Tfoot pos="sticky" bottom={0} zIndex="docked" bgColor="Background">
            <Tr>
              <Td colSpan={keys.length + (groupBy ? 1 : 0)}>
                <Flex wrap="wrap">
                  <FormControl w="fit-content">
                    <FormLabel>Group by</FormLabel>
                    <Select
                      placeholder="(no grouping)"
                      onInput={(ev) => setGroupBy(ev.currentTarget.value)}
                      value={groupBy}
                    >
                      {keys.map((key) => (key === "_id" ? null : <option key={key}>{key}</option>))}
                    </Select>
                  </FormControl>
                </Flex>
              </Td>
            </Tr>
          </Tfoot>
        </>
      )) ?? (
        <Tbody>
          <Tr>
            <Td>{data.loading ? "Loading..." : data.error ? "Error loading data." : "No data to display."}</Td>
          </Tr>
        </Tbody>
      )}
    </Table>
  );
};
