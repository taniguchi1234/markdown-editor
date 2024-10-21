import * as React from 'react'
import {
  Link,
  useHistory,
} from 'react-router-dom'
import styled from 'styled-components'
import { Header } from '../components/header'
import {
  getMemoPageCount,
  getMemos,
  MemoRecord,
} from '../indexeddb/memos'

const { useState, useEffect } = React

const HeaderArea = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  left: 0;
`

const Wrapper = styled.div`
  bottom: 3rem;
  left: 0;
  position: fixed;
  right: 0;
  top: 3rem;
  padding: 0 1rem;
  overflow-y: scroll;
`
const Memo = styled.button`
    display: block;
    background-color: white;
    border: 1px solid gray;
    width: 100%;
    padding: 1rem;
    margin: 1rem 0;
    text-align: left;
  `
const Paging = styled.div`
  bottom: 0;
  height: 3rem;
  left: 0;
  line-height: 2rem;
  padding: 0.5rem;
  position: fixed;
  right: 0;
  text-align: center;
`

const PagingButton = styled.button`
  background: none;
  border: none;
  display: inline-block;
  height: 2rem;
  padding: 0.5rem 1rem;

  &:disabled {
    color: silver;
  }
`
const MemoTitle = styled.div`
    font-size: 1rem;
    margin-bottom: 0.5rem;
  `

const MemoText = styled.div`
    font-size: 0.85rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `
interface Props {
  setText: (text: string) => void
}

export const History: React.FC<Props> = (props) => {
  const { setText } = props

  //useState はこれまでも出てきた通り状態管理のために使用
  const [memos, setMemos] = useState<MemoRecord[]>([])
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const history = useHistory()

  //useEffect は「副作用 (effect) フック」と呼ばれ、レンダリングの後 に実行されます。
  // まず useEffect の第1引数には、実行したい関数を渡します。
  // 今回の場合は getMemos 関数を実行し、非同期処理が終わったら取得したテキスト履歴を setMemos に渡して更新しています。
  // setMemos によって更新されると再描画が実行され、取得された内容が表示されるという流れになります。

  // useEffect 第2引数には、変更を監視する状態の配列を渡します。
  // 今回は []（空の配列）を渡しており、ずっと更新はされないので初回のみ実行されます。
  useEffect(() => {
    getMemos(1).then(setMemos)
    getMemoPageCount().then(setMaxPage)
  }, [])
  const canNextPage: boolean = page < maxPage
  const canPrevPage: boolean = page > 1
  const movePage = (targetPage: number) => {
    if (targetPage < 1 || maxPage < targetPage) {
      return
    }
    setPage(targetPage)
    getMemos(targetPage).then(setMemos)
  }
  return (
    <>
      <HeaderArea>
        <Header title="履歴">
          <Link to="/editor">
            エディタに戻る
          </Link>
        </Header>
      </HeaderArea>
      <Wrapper>
        {memos.map(memo => (
          <Memo
            key={memo.datetime}
            onClick={() => {
              setText(memo.text)
              history.push('/editor')
            }}
          >
            <MemoTitle>{memo.title}</MemoTitle>
            <MemoText>{memo.text}</MemoText>
          </Memo>
        ))}
      </Wrapper>
      <Paging>
        <PagingButton
          onClick={() => movePage(page - 1)}
          disabled={!canPrevPage}
        >
          ＜
        </PagingButton>
        {page} / {maxPage}
        <PagingButton
          onClick={() => movePage(page + 1)}
          disabled={!canNextPage}
        >
          ＞
        </PagingButton>
      </Paging>
    </>
  )
}

//上について
// jsのArray.prototype.map()　を使用　https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/map？
// key → React が配列要素を再描画する際に、変更された要素を特定するための使用するキー
