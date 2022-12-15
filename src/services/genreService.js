const Genre = require('../models/Genre');

exports.getGenres = (search, limit, skip) => {
    const searchObject = {};

    if (search.key === '_id') {
        searchObject._id = search.value;
    } else {
        search.key ? searchObject[search.key] = { $regex: `${search.value}`, $options: 'i' } : {};
    }

    return Genre.find(searchObject)
        .skip(skip)
        .limit(limit);
}

exports.getCount = (search) => {
    const searchObject = {};

    if (search.key === '_id') {
        searchObject._id = search.value;
    } else {
        search.key ? searchObject[search.key] = { $regex: `${search.value}`, $options: 'i' } : {};
    }

    return Genre.count(searchObject);
}

exports.getTotalCount = () => {
    return Genre.count();
}

exports.getOne = (genreId) => {
    return Genre.findOne({ _id: genreId });
}

exports.editGenre = (genreId, updatedData) => {
    return Genre.findByIdAndUpdate({ _id: genreId }, updatedData, { runValidators: true, new: true });
}

exports.addGenre = (data) => {
    const newGenre = new Genre({ value: data.value, label: data.label });

    return newGenre.save();
}

exports.deleteGenre = (genreId) => {
    return Genre.deleteOne({ _id: genreId });
}