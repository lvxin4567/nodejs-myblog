const {
    exec
} = require("../db/mysql")


const getList = (author, keyword) => {
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc;`

    // 返回 promise
    return exec(sql)
}

const getDetail = (id) => {
    let sql = `select * from blogs where id=${id}`
    return exec(sql).then((rows => {
        return rows[0];
    }));

}

const newBlog = (blogdata = {}) => {
    let sql = `insert into blogs (title ,content , createtime, author) 
    values ('${blogdata.title}' , '${blogdata.content}' , ${Date.now()} , '${blogdata.author}') `
    return exec(sql).then(insertData => {
        return {
            id: insertData.insertId
        }
    });
}

const updateBlog = (id, blogdata = {}) => {
    const sql = `
        update blogs set title='${blogdata.title}', content='${blogdata.content}' where id=${id}
    `
    return exec(sql).then(updateData => {
        if (updateData.affectedRows > 0) {
            return true;
        }
        return false;
    })
}

const delBlog = (id , author) => {
    const sql = `delete from blogs where id=${id} and author='${author}'`
    return exec(sql).then(deldata => {
        if (deldata.affectedRows > 0) {
            return true;
        }
        return false;
    })
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}