import React, { useEffect, useState } from 'react';
import { Table, Grid } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';

function Main (props) {
  const { api } = useSubstrate();
  const [blockNumber, setBlockNumber] = useState();
  const [author, setAuthor] = useState();
  const [blockHash, setBlockHash] = useState();
  const [extrinsicsRoot, setExtrinsicsRoot] = useState();
  const [stateRoot, setStateRoot] = useState();
  const [parentHash, setParentHash] = useState();

  useEffect(() => {
    const getInfo = async () => {
      try {
        const blockHash = await api.rpc.chain.getBlockHash();
        const [signedBlock, header] = await Promise.all([
          api.rpc.chain.getBlock(blockHash),
          api.derive.chain.getHeader(blockHash)
        ]);
        setBlockNumber(header.number.toString());
        setAuthor(header.author.toString());
        setParentHash(header.parentHash.toHex());
        setStateRoot(header.stateRoot.toHex());
        setExtrinsicsRoot(header.extrinsicsRoot.toHex());
        setBlockHash(header.hash.toHex());
        // const extrinsics = signedBlock.block?.extrinsics;
        // signedBlock.block?.extrinsics.forEach((ex, index) => {
        //   console.log(index, ex.toHuman());
        // });
      } catch (e) {
        console.error(e);
      }
    };
    setInterval(() => {
      getInfo();
    }, 3000);
  }, [api.rpc.system, api.derive.chain, api.rpc.chain]);

  useEffect(() => {
    const id = setInterval(1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Grid.Column>
      <h1>Last Block details</h1>
      <Table celled striped size='small'>
        <Table.Body>
          <Table.Row>
            <Table.Cell width={3} textAlign='left'>
              {'Block number'}
            </Table.Cell>
            <Table.Cell width={10}>
              <span style={{ display: 'inline-block', minWidth: '31em' }}>
                {blockNumber}
              </span>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell width={3} textAlign='left'>
              {'Author'}
            </Table.Cell>
            <Table.Cell width={10}>
              <span style={{ display: 'inline-block', minWidth: '31em' }}>
                {author}
              </span>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell width={3} textAlign='left'>
              {'Hash'}
            </Table.Cell>
            <Table.Cell width={10}>
              <span style={{ display: 'inline-block', minWidth: '31em' }}>
                {blockHash}
              </span>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell width={3} textAlign='left'>
              {'Parent hash'}
            </Table.Cell>
            <Table.Cell width={10}>
              <span style={{ display: 'inline-block', minWidth: '31em' }}>
                {parentHash}
              </span>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell width={3} textAlign='left'>
              {'State'}
            </Table.Cell>
            <Table.Cell width={10}>
              <span style={{ display: 'inline-block', minWidth: '31em' }}>
                {stateRoot}
              </span>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell width={3} textAlign='left'>
              {'Extrinsics root'}
            </Table.Cell>
            <Table.Cell width={10}>
              <span style={{ display: 'inline-block', minWidth: '31em' }}>
                {extrinsicsRoot}
              </span>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Grid.Column>
  );
}

export default function BlockDetails (props) {
  const { api } = useSubstrate();
  return api.rpc && api.rpc.chain && api.derive.chain ? (
    <Main {...props} />
  ) : null;
}
