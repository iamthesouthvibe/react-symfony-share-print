import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

export const Page404 = () => {
    return (
        <Layout>
            <div className="page-404">
                <div>
                    <h1>Error 404</h1>
                    <Link to="/">Back to the homepage</Link>
                </div>
            </div>
        </Layout>
    )
}
