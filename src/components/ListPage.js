import { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import TabsComponent from './TabsComponent'
import ListView from './ListView'
import PaginationComp from './PaginationComp'
import "./ListPage.css"

import { useTopicListStore } from '../stores/topic'

const ListPage = ({
  activeKey,
  BannerComp,
  defaultActiveKey,
  handleTabSelect,
  tabs
}) => {
  const { username = undefined } = useParams()
  const [searchParams] = useSearchParams()
  const page = searchParams.get('page') || '1'
  const { fetchTopicList, theUser = {} } = useTopicListStore()

  useEffect(() => {
    fetchTopicList(username, page).catch((err) => {
      console.log('err', err)
      console.log('Current Page:', page);
    })
  }, [activeKey, page])

  return (
    <>
      <Header />
      {typeof BannerComp === 'function' ? BannerComp(theUser) : BannerComp}
      <main className="main mx-auto">
        <TabsComponent
          activeKey={activeKey}
          defaultActiveKey={defaultActiveKey}
          handleTabSelect={handleTabSelect}
          tabs={tabs}
        />
        <ListView activeKey={activeKey} handleTabSelect={handleTabSelect} />
        <PaginationComp />
      </main>
    </>
  )
}

export default ListPage
