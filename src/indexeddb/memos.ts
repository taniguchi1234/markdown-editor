import Dexie from 'dexie'

export interface MemoRecord {
  datetime: string
  title: string
  text: string
}

const database = new Dexie('markdown-editor')
database.version(1).stores({ memos: '&datetime' })
const memos: Dexie.Table<MemoRecord, string> = database.table('memos')

export const putMemo = async (title: string, text: string): Promise<void> => {
  const datetime = new Date().toISOString()
  await memos.put({ datetime, title, text })
}
//indexDBから履歴を取得(emos テーブルからデータを取得する処理)。PromiseはTypeScriptの非同期処理を行うためのオブジェクト

const NUM_PER_PAGE: number = 10

export const getMemoPageCount = async (): Promise<number> => {
  const totalCount = await memos.count()
  const pageCount = Math.ceil(totalCount / NUM_PER_PAGE)
  return pageCount > 0 ? pageCount : 1
}
//memos テーブルから総件数を取得します。
//count() は Dexie に定義された関数です。


export const getMemos = (page: number): Promise<MemoRecord[]> => {
  const offset = (page - 1) * NUM_PER_PAGE
  return memos.orderBy('datetime')
    .reverse()
    .offset(offset)
    .limit(NUM_PER_PAGE)
    .toArray()
}
// まず orderBy で datetime（保存した日時）の昇順（古い順）で取得します。
// 次に reverse で並び順を逆にします。つまり datetime（保存した日時）の降順（新しい順）に並べ替えます。
// 最後に toArray で取得したデータを配列に変換して返却します。
